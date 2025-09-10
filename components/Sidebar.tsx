




import React, { useMemo } from 'react';
import { View, ManagementStyle } from '../types';
import { DashboardIcon, AnimalIcon, HabitatIcon, InventoryIcon, FinanceIcon, AIIcon, MapIcon, ClientIcon, PermitIcon, GeneticsIcon, HarvestPlanningIcon, PopulationIcon } from './ui/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  managementStyle: ManagementStyle;
  setManagementStyle: (style: ManagementStyle) => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, managementStyle, setManagementStyle }) => {
  
  const navItems = useMemo(() => {
    const allItems = [
      { view: View.Dashboard, icon: <DashboardIcon /> },
      { view: View.Animals, icon: <AnimalIcon />, style: 'Intensive' },
      { view: View.PopulationSurveys, icon: <PopulationIcon />, style: 'Extensive' },
      { view: View.GeneticAnalysis, icon: <GeneticsIcon />, style: 'Intensive' },
      { view: View.HarvestPlanning, icon: <HarvestPlanningIcon /> },
      { view: View.Clients, icon: <ClientIcon /> },
      { view: View.Permits, icon: <PermitIcon /> },
      { view: View.Habitat, icon: <HabitatIcon /> },
      { view: View.RanchMap, icon: <MapIcon /> },
      { view: View.Inventory, icon: <InventoryIcon /> },
      { view: View.Finance, icon: <FinanceIcon /> },
      { view: View.AIAssistant, icon: <AIIcon /> },
    ];
    return allItems.filter(item => !item.style || item.style === managementStyle);
  }, [managementStyle]);


  return (
    <aside className="w-64 bg-brand-primary p-4 flex flex-col shadow-2xl">
      <div className="text-center py-4 mb-4">
        <h1 className="text-2xl font-bold text-white tracking-wider">Rancher Pro</h1>
        <p className="text-sm text-brand-light">Management Suite</p>
      </div>

       {/* Management Style Toggle */}
      <div className="px-2 mb-4">
          <div className="text-xs text-brand-light/70 mb-1">Management Style</div>
          <div className="flex bg-brand-dark rounded-lg p-1">
              <button
                  onClick={() => setManagementStyle('Intensive')}
                  className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${managementStyle === 'Intensive' ? 'bg-brand-secondary text-white shadow' : 'text-brand-light/80 hover:bg-brand-primary/50'}`}
              >
                  Intensive
              </button>
              <button
                  onClick={() => setManagementStyle('Extensive')}
                  className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${managementStyle === 'Extensive' ? 'bg-brand-secondary text-white shadow' : 'text-brand-light/80 hover:bg-brand-primary/50'}`}
              >
                  Extensive
              </button>
          </div>
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