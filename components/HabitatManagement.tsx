
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { HabitatZone, Animal, VeldAssessment, RainfallLog } from '../types';
import { WaterIcon, ForageIcon, IssueIcon, VeldIcon, HistoryIcon, PlusIcon } from './ui/Icons';

interface HabitatManagementProps {
  habitats: HabitatZone[];
  animals: Animal[];
  veldAssessments: VeldAssessment[];
  addVeldAssessment: (assessment: Omit<VeldAssessment, 'id' | 'condition'>) => void;
  updateHabitat: (habitat: HabitatZone) => void;
  rainfallLogs: RainfallLog[];
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

const getVeldConditionFactor = (assessment: VeldAssessment | undefined): number => {
  if (!assessment) return 1.0; // Default if no assessment exists
  const totalScore = assessment.speciesComposition + assessment.basalCover; // Max score of 20
  
  if (totalScore >= 18) return 1.2; // Excellent
  if (totalScore >= 14) return 1.0; // Good
  if (totalScore >= 8) return 0.75; // Fair
  return 0.5; // Poor
};


const StockingDensityBar: React.FC<{current: string; capacity: string}> = ({current, capacity}) => {
    const currentNum = parseFloat(current);
    const capacityNum = parseFloat(capacity);
    const percentage = capacityNum > 0 ? (currentNum / capacityNum) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage > 90) barColor = 'bg-red-500';
    else if (percentage > 75) barColor = 'bg-yellow-500';

    return (
        <div>
             <div className="flex justify-end mb-1">
                <span className="text-sm font-medium text-gray-500">{current} / {capacity} LSU</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%`}}></div>
            </div>
        </div>
    );
};

export const HabitatManagement: React.FC<HabitatManagementProps> = ({ habitats, animals, veldAssessments, addVeldAssessment, updateHabitat, rainfallLogs }) => {
  const [modalZone, setModalZone] = useState<HabitatZone | null>(null);
  
  const [editableParams, setEditableParams] = useState({
    areaHectares: 0,
    forageProductionFactor: 0,
    grassToBrowseRatio: 0,
  });

  const [newAssessment, setNewAssessment] = useState({
    date: new Date().toISOString().split('T')[0],
    speciesComposition: 7,
    basalCover: 7,
    soilErosion: 2,
    notes: ''
  });

  const handleOpenModal = (zone: HabitatZone) => {
    setModalZone(zone);
    setEditableParams({
      areaHectares: zone.areaHectares,
      forageProductionFactor: zone.forageProductionFactor,
      grassToBrowseRatio: zone.grassToBrowseRatio,
    });
  };

  const handleCloseModal = () => {
    setModalZone(null);
  };

  const handleAssessmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssessment(prev => ({ ...prev, [name]: name === 'notes' ? value : parseInt(value, 10) }));
  };

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalZone) return;
    addVeldAssessment({
      ...newAssessment,
      habitatZoneId: modalZone.id,
    });
    // Reset form
    setNewAssessment({
      date: new Date().toISOString().split('T')[0],
      speciesComposition: 7,
      basalCover: 7,
      soilErosion: 2,
      notes: ''
    });
  };
  
  const handleEcologicalParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableParams(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleEcologicalParamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalZone) return;
    updateHabitat({
      ...modalZone,
      ...editableParams,
    });
    handleCloseModal();
  };

  const zoneAssessments = modalZone ? veldAssessments.filter(a => a.habitatZoneId === modalZone.id) : [];

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Habitat Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitats.map((zone) => {
          const animalsInZone = animals.filter(a => a.location === zone.name);
          
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

          const annualRainfallMM = rainfallLogs
              .filter(log => new Date(log.date + 'T00:00:00') >= oneYearAgo)
              .reduce((sum, log) => sum + log.amount, 0);

          const totalForageProductionKG = annualRainfallMM * zone.forageProductionFactor * zone.areaHectares;
          const availableForageKG = totalForageProductionKG * 0.25; // 25% sustainable utilization rate

          const availableGrazerForageKG = availableForageKG * zone.grassToBrowseRatio;
          const availableBrowserForageKG = availableForageKG * (1 - zone.grassToBrowseRatio);
          
          const LSU_CONSUMPTION_PER_YEAR = 10 * 365; // Assumes 1 LSU eats 10kg Dry Matter per day

          const calculatedGrazerCapacityLSU = availableGrazerForageKG / LSU_CONSUMPTION_PER_YEAR;
          const calculatedBrowserCapacityLSU = availableBrowserForageKG / LSU_CONSUMPTION_PER_YEAR;

          const latestAssessment = veldAssessments
            .filter(a => a.habitatZoneId === zone.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          const veldFactor = getVeldConditionFactor(latestAssessment);
          
          const actualGrazerCapacityLSU = calculatedGrazerCapacityLSU * veldFactor;
          const actualBrowserCapacityLSU = calculatedBrowserCapacityLSU * veldFactor;

          const currentStocking = animalsInZone.reduce((acc, animal) => {
            if (animal.forageType === 'Grazer') {
              acc.grazerLSU += animal.lsuEquivalent;
            } else if (animal.forageType === 'Browser') {
              acc.browserLSU += animal.lsuEquivalent;
            } else if (animal.forageType === 'Mixed-Feeder') {
              acc.grazerLSU += animal.lsuEquivalent * 0.5;
              acc.browserLSU += animal.lsuEquivalent * 0.5;
            }
            return acc;
          }, { grazerLSU: 0, browserLSU: 0 });

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
                    <p className="text-sm font-medium text-brand-dark">Grazing Capacity</p>
                    <StockingDensityBar
                      current={currentStocking.grazerLSU.toFixed(2)}
                      capacity={actualGrazerCapacityLSU.toFixed(2)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Currently stocked at {currentStocking.grazerLSU.toFixed(2)} LSU</p>

                    <p className="text-sm font-medium text-brand-dark mt-4">Browsing Capacity</p>
                    <StockingDensityBar
                      current={currentStocking.browserLSU.toFixed(2)}
                      capacity={actualBrowserCapacityLSU.toFixed(2)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Currently stocked at {currentStocking.browserLSU.toFixed(2)} LSU</p>
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
              <div className="mt-4 pt-4 border-t">
                 <button onClick={() => handleOpenModal(zone)} className="w-full text-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Manage Veld
                 </button>
              </div>
            </Card>
          );
        })}
      </div>
      
      <Modal isOpen={!!modalZone} onClose={handleCloseModal} title={`Manage Veld & Ecology for ${modalZone?.name}`}>
        <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-brand-dark mb-2 flex items-center"><HistoryIcon className="w-5 h-5 mr-2"/> Assessment History</h4>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                {zoneAssessments.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {zoneAssessments.map(assessment => (
                      <li key={assessment.id} className="py-2">
                        <div className="flex justify-between items-center">
                           <p className="font-semibold text-sm">{assessment.date}: <span className={getStatusColor(assessment.condition, 'veld')}>{assessment.condition}</span></p>
                        </div>
                        {assessment.notes && <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-gray-200">{assessment.notes}</p>}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-500 text-center py-4">No assessments logged yet.</p>}
              </div>
            </div>

            <div>
               <h4 className="text-lg font-semibold text-brand-dark mb-3 border-t pt-4">Log New Scientific Assessment</h4>
                <form onSubmit={handleAssessmentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                          <input type="date" name="date" id="date" value={newAssessment.date} onChange={handleAssessmentInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="speciesComposition" className="block text-sm font-medium text-gray-700">Species Composition ({newAssessment.speciesComposition}/10)</label>
                      <input type="range" min="1" max="10" name="speciesComposition" id="speciesComposition" value={newAssessment.speciesComposition} onChange={handleAssessmentInputChange} className="mt-1 block w-full" />
                    </div>
                     <div>
                      <label htmlFor="basalCover" className="block text-sm font-medium text-gray-700">Basal Cover ({newAssessment.basalCover}/10)</label>
                      <input type="range" min="1" max="10" name="basalCover" id="basalCover" value={newAssessment.basalCover} onChange={handleAssessmentInputChange} className="mt-1 block w-full" />
                    </div>
                     <div>
                      <label htmlFor="soilErosion" className="block text-sm font-medium text-gray-700">Soil Erosion ({newAssessment.soilErosion}/5)</label>
                      <input type="range" min="1" max="5" name="soilErosion" id="soilErosion" value={newAssessment.soilErosion} onChange={handleAssessmentInputChange} className="mt-1 block w-full" />
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                        <textarea name="notes" id="notes" value={newAssessment.notes} onChange={handleAssessmentInputChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow">
                           <PlusIcon className="w-5 h-5 mr-2" />
                           Log Assessment
                        </button>
                    </div>
                </form>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-brand-dark mb-3 border-t pt-4">Ecological Parameters</h4>
              <form onSubmit={handleEcologicalParamSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="areaHectares" className="block text-sm font-medium text-gray-700">Area (Hectares)</label>
                          <input type="number" step="0.1" name="areaHectares" id="areaHectares" value={editableParams.areaHectares} onChange={handleEcologicalParamChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                      </div>
                      <div>
                          <label htmlFor="forageProductionFactor" className="block text-sm font-medium text-gray-700">Forage Factor (kg/ha/mm)</label>
                          <input type="number" step="0.1" name="forageProductionFactor" id="forageProductionFactor" value={editableParams.forageProductionFactor} onChange={handleEcologicalParamChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                      </div>
                  </div>
                   <div>
                      <label htmlFor="grassToBrowseRatio" className="block text-sm font-medium text-gray-700">Grass-to-Browse Ratio ({Math.round(editableParams.grassToBrowseRatio * 100)}% Grass)</label>
                      <input type="range" min="0" max="1" step="0.05" name="grassToBrowseRatio" id="grassToBrowseRatio" value={editableParams.grassToBrowseRatio} onChange={handleEcologicalParamChange} className="mt-1 block w-full" />
                    </div>
                  <div className="flex justify-end">
                      <button type="submit" className="flex items-center px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow">
                         Update Parameters
                      </button>
                  </div>
              </form>
            </div>
        </div>
      </Modal>

    </div>
  );
};