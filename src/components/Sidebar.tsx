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
        className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
          isActive
              ? "bg-emerald-50 text-emerald-700 font-semibold cursor-pointer"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
        <span className="ml-3 truncate">{label}</span>
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
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      <aside
        className={`fixed lg:relative inset-y-0 left-0 w-64 p-6 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Barra lateral"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Finanças</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 cursor-pointer">
            {ICONS.close}
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavLink icon={ICONS.home} label="Dashboard" pageName="dashboard" activePage={activePage} onClick={handleNavigation} />
            <NavLink icon={ICONS.transactions} label="Transações" pageName="transactions" activePage={activePage} onClick={handleNavigation} />
          </ul>
        </nav>

        <div className="mt-6">
          <button onClick={logout} className="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
            {ICONS.logout}
            <span className="ml-3">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
