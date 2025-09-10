import React from 'react';
import { View } from '../types';
import { DashboardIcon, AnimalIcon, HabitatIcon, InventoryIcon, FinanceIcon, AIIcon, MapIcon, ClientIcon, PermitIcon } from './ui/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: View;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-brand-secondary text-white shadow-lg'
        : 'text-brand-light hover:bg-brand-primary/50 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: View.Dashboard, icon: <DashboardIcon /> },
    { view: View.Animals, icon: <AnimalIcon /> },
    { view: View.Clients, icon: <ClientIcon /> },
    { view: View.Permits, icon: <PermitIcon /> },
    { view: View.Habitat, icon: <HabitatIcon /> },
    { view: View.RanchMap, icon: <MapIcon /> },
    { view: View.Inventory, icon: <InventoryIcon /> },
    { view: View.Finance, icon: <FinanceIcon /> },
    { view: View.AIAssistant, icon: <AIIcon /> },
  ];

  return (
    <aside className="w-64 bg-brand-primary p-4 flex flex-col shadow-2xl">
      <div className="text-center py-4 mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wider">Rancher Pro</h1>
        <p className="text-sm text-brand-light">Management Suite</p>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              icon={item.icon}
              label={item.view}
              isActive={currentView === item.view}
              onClick={() => setCurrentView(item.view)}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-brand-light/50 text-xs">
        <p>&copy; {new Date().getFullYear()} Game Rancher Pro</p>
      </div>
    </aside>
  );
};