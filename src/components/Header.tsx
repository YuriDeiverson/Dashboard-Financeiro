import React, { useState, useRef, useEffect } from "react";
import { createPortal } from 'react-dom';
import { User, TransactionStatus } from "../utils/types";
import { useFilters } from "../hooks/useFilters";
import { ICONS } from "../constants";

interface HeaderProps {
  user: User | null;
  toggleSidebar: () => void;
  accountsOptions: string[];
  statesOptions: string[];
}

const MultiSelectDropdown: React.FC<{
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ options, selected, onChange, label, isOpen, onToggle }) => {
  const isAllSelected = selected.length === options.length;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ left: number; top: number; width: number } | null>(null);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((i) => i !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    onChange(isAllSelected ? [] : options);
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
              checked={selected.includes(option)}
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
        {label} ({selected.length})
      </button>
      {isOpen && coords && createPortal(dropdown, document.body)}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar, accountsOptions, statesOptions }) => {
  const { filters, setFilters } = useFilters();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const labelClass = "text-sm font-medium text-gray-700";
  const inputClass =
    "mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300";

  return (
    <header className="mb-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-[0_6px_24px_rgba(12,12,16,0.06)] flex items-center justify-between mb-6">
        <button onClick={toggleSidebar} className="text-gray-500 lg:hidden focus:outline-none cursor-pointer">
          {ICONS.menu}
        </button>
        <h2 className="text-xl font-semibold text-gray-900 hidden sm:block">Visão Geral</h2>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <img
            src={`https://i.pravatar.cc/100?u=${user?.email}`}
            alt="Avatar"
            className="h-10 w-10 rounded-full border border-gray-200 shadow-sm"
          />
        </div>
      </div>

  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-[0_6px_24px_rgba(12,12,16,0.06)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className={labelClass}>Data inicial</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Data final</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Contas</label>
          <MultiSelectDropdown
            options={accountsOptions}
            selected={filters.accounts}
            onChange={(s) => setFilters((f) => ({ ...f, accounts: s }))}
            label="Contas"
            isOpen={openDropdown === 'accounts'}
            onToggle={() => setOpenDropdown((p) => (p === 'accounts' ? null : 'accounts'))}
          />
        </div>
        <div>
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
        <div>
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
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                status: e.target.value as TransactionStatus | "all",
              }))
            }
            className={inputClass}
          >
            <option value="all">Todos</option>
            <option value="completed">Completo</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
