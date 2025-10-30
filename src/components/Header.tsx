import React, { useState, useRef, useEffect } from "react";
import { createPortal } from 'react-dom';
import { User } from "../utils/types";
import { useFilters } from "../hooks/useFilters";
import { ICONS } from "../constants";
import DateRangePicker from "./DateRangePicker";

interface HeaderProps {
  user: User | null;
  toggleSidebar: () => void;
  statesOptions: string[];
  companiesOptions: string[];
}

const MultiSelectDropdown: React.FC<{
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ options, selected, onChange, label, isOpen, onToggle }) => {
  // Garantir que selected seja sempre um array
  const safeSelected = Array.isArray(selected) ? selected : [];
  const isAllSelected = safeSelected.length === options.length;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ left: number; top: number; width: number } | null>(null);

  const handleToggle = (option: string) => {
    const newSelected = safeSelected.includes(option)
      ? safeSelected.filter((item) => item !== option)
      : [...safeSelected, option];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options);
    }
  };

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ left: rect.left, top: rect.bottom + window.scrollY, width: rect.width });
    }

    const onResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({ left: rect.left, top: rect.bottom + window.scrollY, width: rect.width });
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (buttonRef.current && buttonRef.current.contains(target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      onToggle();
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isOpen, onToggle]);

  const dropdown = (
    <div
      ref={dropdownRef}
      className="bg-white rounded-xl border border-gray-200 shadow-lg max-h-56 overflow-y-auto"
      style={{ position: 'absolute', left: coords?.left ?? 0, top: coords?.top ?? 0, width: coords?.width ?? 'auto', zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <label className="flex items-center px-2 py-1">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="h-4 w-4 text-emerald-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Selecionar todos</span>
        </label>
        <hr className="my-1 border-gray-100" />
        {options.map((option) => (
          <label key={option} className="flex items-center px-2 py-1 hover:bg-gray-50 rounded-md">
            <input
              type="checkbox"
              checked={safeSelected.includes(option)}
              onChange={() => handleToggle(option)}
              className="h-4 w-4 text-emerald-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="w-full text-left bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
      >
        {label} ({safeSelected.length})
      </button>
      {isOpen && coords && createPortal(dropdown, document.body)}
    </div>
  );
};

const SearchableDropdown: React.FC<{
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
  placeholder: string;
}> = ({ options, selected, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Filtrar opções baseado no termo de busca
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Se o campo for limpo, também limpa a seleção
    if (value === '') {
      onChange('');
    }
    // Ao digitar, filtra pelos dados que correspondem ao texto
    setIsOpen(true);
  };

  const updateCoords = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left,
        top: rect.bottom + window.scrollY,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleResize = () => updateCoords();
      const handleScroll = () => updateCoords();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Quando uma empresa é selecionada externamente, atualiza o campo de busca
  useEffect(() => {
    if (selected && selected !== searchTerm) {
      setSearchTerm(selected);
    }
  }, [selected, searchTerm]);

  const dropdown = (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        left: coords?.left || 0,
        top: coords?.top || 0,
        width: coords?.width || 200,
        zIndex: 1000,
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div className="p-2 space-y-1">
        {selected && (
          <>
            <button
              onClick={handleClear}
              className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Limpar seleção
            </button>
            <hr className="my-1 border-gray-100" />
          </>
        )}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-2 py-1 text-sm rounded-md hover:bg-gray-50 ${
                selected === option ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
              }`}
            >
              {option}
            </button>
          ))
        ) : (
          <div className="px-2 py-1 text-sm text-gray-500">
            Nenhuma empresa encontrada
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      />
      {selected && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
          ✓
        </div>
      )}
      {isOpen && coords && createPortal(dropdown, document.body)}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar, statesOptions, companiesOptions }) => {
  const { filters, setFilters } = useFilters();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const labelClass = "text-sm font-medium text-gray-700";
  const inputClass =
    "mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300";

  // Filtrar empresas baseado na busca
  const filteredCompaniesOptions = filters.companies
    ? companiesOptions.filter(company =>
        company.toLowerCase().includes(filters.companies.toLowerCase())
      )
    : companiesOptions;

  // Empresas selecionadas que correspondem ao filtro de busca
  const filteredSelectedCompanies = (filters.companiesMulti || []).filter(company =>
    filteredCompaniesOptions.includes(company)
  );

  // Função para gerar as iniciais do email
  const getInitialsFromEmail = (email: string): string => {
    if (!email) return "U";
    const emailPart = email.split("@")[0];
    const parts = emailPart.split(/[._-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return emailPart.substring(0, 2).toUpperCase();
  };

  return (
    <header className="mb-6">
      {/* Header superior com perfil */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_6px_24px_rgba(12,12,16,0.06)] flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={toggleSidebar} className="text-gray-500 lg:hidden focus:outline-none cursor-pointer p-1">
            {ICONS.menu}
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Visão Geral</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-gray-900 text-sm sm:text-base">{user?.name}</p>
            <p className="text-xs sm:text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-gray-200 shadow-sm bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-semibold text-xs sm:text-sm">
              {user?.email ? getInitialsFromEmail(user.email) : "U"}
            </span>
          </div>
          {/* Nome no mobile - só aparece em telas pequenas */}
          <div className="sm:hidden">
            <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_6px_24px_rgba(12,12,16,0.06)]">
        {/* Botão para expandir filtros no mobile */}
        <div className="lg:hidden p-4 border-b border-gray-100">
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center justify-between w-full text-left focus:outline-none"
          >
            <span className="text-sm font-medium text-gray-700">Filtros</span>
            <div className={`transform transition-transform duration-200 ${isFiltersExpanded ? 'rotate-180' : ''}`}>
              {ICONS.chevronDown}
            </div>
          </button>
        </div>

        {/* Container dos filtros - sempre visível no desktop, condicional no mobile */}
        <div className={`
          ${isFiltersExpanded ? 'block' : 'hidden'} lg:block
          p-4 sm:p-5 transition-all duration-300 ease-in-out
        `}>
          {/* Layout mobile - stack vertical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClass}>Período</label>
            <DateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(start, end) => setFilters((f) => ({ ...f, startDate: start, endDate: end }))}
              isOpen={openDropdown === 'dateRange'}
              onToggle={() => setOpenDropdown((p) => (p === 'dateRange' ? null : 'dateRange'))}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClass}>Buscar Empresas</label>
            <SearchableDropdown
              options={companiesOptions}
              selected={filters.companies}
              onChange={(s) => setFilters((f) => ({ ...f, companies: s }))}
              placeholder="Digite para buscar empresas..."
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClass}>Empresas</label>
            <MultiSelectDropdown
              options={filteredCompaniesOptions}
              selected={filteredSelectedCompanies}
              onChange={(s) => {
                // Quando mudar a seleção, atualizar apenas as empresas filtradas
                // Manter as empresas não visíveis no filtro + adicionar as novas seleções
                const empresasNaoVisiveis = (filters.companiesMulti || []).filter(company =>
                  !filteredCompaniesOptions.includes(company)
                );
                const novaSelecao = [...empresasNaoVisiveis, ...s];
                setFilters((f) => ({ ...f, companiesMulti: novaSelecao }));
              }}
              label="Empresas"
              isOpen={openDropdown === 'companiesMulti'}
              onToggle={() => setOpenDropdown((p) => (p === 'companiesMulti' ? null : 'companiesMulti'))}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClass}>Estados</label>
            <MultiSelectDropdown
              options={statesOptions}
              selected={filters.states}
              onChange={(s) => setFilters((f) => ({ ...f, states: s }))}
              label="Estados"
              isOpen={openDropdown === 'states'}
              onToggle={() => setOpenDropdown((p) => (p === 'states' ? null : 'states'))}
            />
          </div>
          <div className="sm:col-span-1">
            <label className={labelClass}>Tipo</label>
            <select
              value={filters.txType ?? 'all'}
              onChange={(e) => setFilters((f) => ({ ...f, txType: e.target.value as 'all' | 'income' | 'expense' }))}
              className={inputClass}
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
