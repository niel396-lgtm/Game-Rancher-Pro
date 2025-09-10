
import React from 'react';
import { Card } from './ui/Card';
import { HabitatZone, Animal } from '../types';
import { WaterIcon, ForageIcon, IssueIcon, VeldIcon } from './ui/Icons';

interface HabitatManagementProps {
  habitats: HabitatZone[];
  animals: Animal[];
}

const getStatusColor = (status: string, type: 'water' | 'forage' | 'veld') => {
  if (type === 'water') {
    if (status === 'High') return 'text-blue-500';
    if (status === 'Normal') return 'text-green-500';
    if (status === 'Low') return 'text-yellow-500';
  }
  if (type === 'forage') {
    if (status === 'Abundant') return 'text-green-500';
    if (status === 'Moderate') return 'text-blue-500';
    if (status === 'Scarce') return 'text-yellow-500';
  }
  if (type === 'veld') {
    if (status === 'Excellent') return 'text-green-500';
    if (status === 'Good') return 'text-blue-500';
    if (status === 'Fair') return 'text-yellow-500';
    if (status === 'Poor') return 'text-red-500';
  }
  return 'text-gray-500';
};

const StockingDensityBar: React.FC<{current: number; capacity: number}> = ({current, capacity}) => {
    const percentage = capacity > 0 ? (current / capacity) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage > 90) barColor = 'bg-red-500';
    else if (percentage > 75) barColor = 'bg-yellow-500';

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-brand-dark">Stocking Density</span>
                <span className="text-sm font-medium text-gray-500">{current} / {capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%`}}></div>
            </div>
        </div>
    );
};

export const HabitatManagement: React.FC<HabitatManagementProps> = ({ habitats, animals }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Habitat Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitats.map((zone) => {
          const animalsInZone = animals.filter(a => a.location === zone.name).length;
          return (
            <Card key={zone.id} title={zone.name} className="flex flex-col">
              <div className="space-y-4 flex-grow">
                <div className="flex items-center">
                  <WaterIcon className={`w-6 h-6 mr-3 ${getStatusColor(zone.waterLevel, 'water')}`} />
                  <div>
                    <p className="text-sm text-gray-500">Water Level</p>
                    <p className="font-semibold">{zone.waterLevel}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ForageIcon className={`w-6 h-6 mr-3 ${getStatusColor(zone.forageQuality, 'forage')}`} />
                  <div>
                    <p className="text-sm text-gray-500">Forage Quality</p>
                    <p className="font-semibold">{zone.forageQuality}</p>
                  </div>
                </div>
                 <div className="flex items-center">
                  <VeldIcon className={`w-6 h-6 mr-3 ${getStatusColor(zone.veldCondition, 'veld')}`} />
                  <div>
                    <p className="text-sm text-gray-500">Veld Condition</p>
                    <p className="font-semibold">{zone.veldCondition}</p>
                  </div>
                </div>
                 <div className="pt-2">
                    <StockingDensityBar current={animalsInZone} capacity={zone.carryingCapacity} />
                </div>
              </div>
              {zone.issues.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm flex items-center mb-2">
                    <IssueIcon className="w-5 h-5 mr-2 text-red-500" />
                    Active Issues
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {zone.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
