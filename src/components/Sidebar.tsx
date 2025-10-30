import React from "react";
import { ICONS } from "../constants";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  logout: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  pageName: string;
  activePage: string;
  onClick: (pageName: string) => void;
}> = ({ icon, label, pageName, activePage, onClick }) => {
  const isActive = activePage === pageName;
  return (
    <li>
      <button
        onClick={() => onClick(pageName)}
        className={`
          flex items-center w-full p-3 rounded-xl 
          transition-all duration-200 group
          ${isActive
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transform scale-[1.02]"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
        `}
        aria-current={isActive ? "page" : undefined}
      >
        <span className={`
          w-6 h-6 flex items-center justify-center 
          transition-transform duration-200
          ${isActive ? "scale-110" : "group-hover:scale-105"}
        `}>
          {icon}
        </span>
        <span className="ml-3 font-medium">{label}</span>
        {isActive && (
          <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, logout, activePage, setActivePage }) => {
  const handleNavigation = (page: string) => {
    setActivePage(page);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile - removendo o overlay escuro */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 w-72 sm:w-80 lg:w-64 
          bg-white/95 backdrop-blur-md border-r border-gray-200
          flex flex-col z-50 
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}
          lg:shadow-none lg:bg-white lg:backdrop-blur-none
        `}
        aria-label="Barra lateral"
      >
        {/* Header da sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Finanças</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            {ICONS.close}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <NavLink 
              icon={ICONS.home} 
              label="Dashboard" 
              pageName="dashboard" 
              activePage={activePage} 
              onClick={handleNavigation} 
            />
            <NavLink 
              icon={ICONS.transactions} 
              label="Transações" 
              pageName="transactions" 
              activePage={activePage} 
              onClick={handleNavigation} 
            />
          </ul>
        </nav>

        {/* Footer da sidebar */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout} 
            className="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <span className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              {ICONS.logout}
            </span>
            <span className="ml-3 font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
