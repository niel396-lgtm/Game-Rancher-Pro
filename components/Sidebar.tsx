import React, { useMemo } from 'react';
import { View, ManagementStyle } from '../types';
import { DashboardIcon, AnimalIcon, HabitatIcon, InventoryIcon, FinanceIcon, AIIcon, MapIcon, ClientIcon, PermitIcon, StudBookIcon, HarvestPlanningIcon, PopulationIcon, ReportIcon, PHIcon, HuntIcon, VeterinaryIcon, DocumentIcon, GameMeatIcon, BioeconomicsIcon, SearchIcon } from './ui/Icons';

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
    className={`flex items-center my-1 rounded-r-lg cursor-pointer transition-all duration-200 py-3 pr-3 ${
      isActive
        ? 'bg-brand-primary/60 text-white border-l-4 border-brand-accent pl-2'
        : 'text-brand-light hover:bg-brand-primary/50 hover:text-white pl-3'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium text-sm">{label}</span>
  </li>
);

const NavGroup: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-3 mt-6 mb-1 text-xs font-semibold uppercase text-brand-light/60 tracking-wider">
        {title}
    </h3>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, managementStyle, setManagementStyle }) => {
  
  const extensiveNavItems = [
    { view: View.PopulationSurveys, icon: <PopulationIcon /> },
    { view: View.BioeconomicsReport, icon: <BioeconomicsIcon /> },
  ];

  const intensiveNavItems = [
      { view: View.Animals, icon: <AnimalIcon /> },
      { view: View.VeterinaryLog, icon: <VeterinaryIcon /> },
      { view: View.StudBook, icon: <StudBookIcon /> },
  ];

  const coreNavGroups = [
      {
          group: 'Core',
          items: [
              { view: View.Dashboard, icon: <DashboardIcon /> },
          ]
      },
      {
          group: 'Animal Science',
          items: managementStyle === 'Intensive' ? intensiveNavItems : extensiveNavItems
      },
      {
          group: 'Operations',
          items: [
              { view: View.HarvestPlanning, icon: <HarvestPlanningIcon /> },
              { view: View.Habitat, icon: <HabitatIcon /> },
              { view: View.RanchMap, icon: <MapIcon /> },
              { view: View.GameMeat, icon: <GameMeatIcon /> },
          ]
      },
      {
          group: 'Business',
          items: [
              { view: View.Clients, icon: <ClientIcon /> },
              { view: View.PHManagement, icon: <PHIcon /> },
              { view: View.HuntRegister, icon: <HuntIcon /> },
              { view: View.Permits, icon: <PermitIcon /> },
              { view: View.Documents, icon: <DocumentIcon /> },
              { view: View.Inventory, icon: <InventoryIcon /> },
              { view: View.Finance, icon: <FinanceIcon /> },
              { view: View.AnnualReport, icon: <ReportIcon /> },
          ]
      },
       {
          group: 'Tools',
          items: [
               { view: View.AIAssistant, icon: <AIIcon /> },
          ]
      }
  ];

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
      
      <nav className="flex-grow overflow-y-auto">
        <ul>
            {coreNavGroups.map(group => (
                <React.Fragment key={group.group}>
                    <NavGroup title={group.group} />
                    {group.items.map((item) => (
                         <NavItem
                            key={item.view}
                            icon={item.icon}
                            label={item.view}
                            isActive={currentView === item.view}
                            onClick={() => setCurrentView(item.view)}
                        />
                    ))}
                </React.Fragment>
            ))}
        </ul>

         <div className="mt-4 pt-4 border-t border-brand-primary/20">
            <NavGroup title="Public Portal" />
            <ul>
                <NavItem
                    key={View.RanchDiscovery}
                    icon={<SearchIcon />}
                    label={View.RanchDiscovery}
                    isActive={currentView === View.RanchDiscovery}
                    onClick={() => setCurrentView(View.RanchDiscovery)}
                />
            </ul>
        </div>
      </nav>
      <div className="mt-auto text-center text-brand-light/50 text-xs">
        <p>&copy; {new Date().getFullYear()} Game Rancher Pro</p>
      </div>
    </aside>
  );
};
