
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Animal, HabitatZone, Mortality, Harvest, Transaction, Client, Permit } from '../types';
import { PlusIcon, TrashIcon, StarIcon, ExportIcon } from './ui/Icons';
import { Modal } from './ui/Modal';
import { AnimalProfile } from './AnimalProfile';


interface AnimalManagementProps {
  animals: Animal[];
  habitats: HabitatZone[];
  addAnimal: (animal: Omit<Animal, 'id'>) => void;
  removeAnimal: (id: string) => void;
  mortalities: Mortality[];
  logAnimalMortality: (animal: Animal, cause: string) => void;
  harvests: Harvest[];
  logAnimalHarvest: (animal: Animal, harvestData: Omit<Harvest, 'id'|'animalTagId'|'species'|'date'|'location'>) => void;
  transactions: Transaction[];
  clients: Client[];
  permits: Permit[];
}

const getHealthColor = (health: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
  switch (health) {
    case 'Excellent': return 'bg-green-100 text-green-800';
    case 'Good': return 'bg-blue-100 text-blue-800';
    case 'Fair': return 'bg-yellow-100 text-yellow-800';
    case 'Poor': return 'bg-red-100 text-red-800';
  }
};

const ConditionScore: React.FC<{ score: number }> = ({ score }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`w-5 h-5 ${i < score ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

// Utility function to handle CSV export
const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || !rows.length) {
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
                cell = cell instanceof Date
                    ? cell.toLocaleString()
                    : cell.toString().replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


export const AnimalManagement: React.FC<AnimalManagementProps> = ({ animals, habitats, addAnimal, removeAnimal, mortalities, logAnimalMortality, harvests, logAnimalHarvest, transactions, clients, permits }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'mortality' | 'harvest'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [animalToRemove, setAnimalToRemove] = useState<Animal | null>(null);
  const [isLogMortalityOpen, setIsLogMortalityOpen] = useState(false);
  const [causeOfDeath, setCauseOfDeath] = useState('');
  
  const [isLogHarvestOpen, setIsLogHarvestOpen] = useState(false);
  const [harvestData, setHarvestData] = useState({ 
    hunter: '', 
    method: 'Rifle', 
    trophyMeasurements: '',
    hornLengthL: '',
    hornLengthR: '',
    tipToTipSpread: '',
    clientId: '',
    permitId: '',
    photoUrl: '',
  });

  const [viewingProfile, setViewingProfile] = useState<Animal | null>(null);

  // FIX: Added missing properties `forageType` and `lsuEquivalent` to initial state to match the `Animal` type.
  const [newAnimal, setNewAnimal] = useState({
      tagId: '', species: '', age: 0, sex: 'Female' as 'Male'|'Female', health: 'Good' as Animal['health'], conditionScore: 3, location: habitats[0]?.name || '', forageType: 'Mixed-Feeder' as Animal['forageType'], lsuEquivalent: 0.5
  });

  // FIX: Updated input handler to parse `lsuEquivalent` as a float and made integer parsing more robust.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewAnimal(prev => ({ ...prev, [name]: name === 'age' || name === 'conditionScore' ? parseInt(value, 10) || 0 : (name === 'lsuEquivalent' ? parseFloat(value) || 0 : value) }));
  };
  
  const handleHarvestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setHarvestData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAnimal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newAnimal.tagId || !newAnimal.species || newAnimal.age <= 0) {
          alert('Please fill all required fields');
          return;
      }
      addAnimal(newAnimal);
      setIsAddModalOpen(false);
      // FIX: Included `forageType` and `lsuEquivalent` in the state reset object.
      setNewAnimal({ tagId: '', species: '', age: 0, sex: 'Female', health: 'Good', conditionScore: 3, location: habitats[0]?.name || '', forageType: 'Mixed-Feeder', lsuEquivalent: 0.5 });
  };
  
  const handleOpenRemoveConfirmation = (animal: Animal) => {
    setAnimalToRemove(animal);
  };

  const handleCloseRemoveModals = () => {
    setAnimalToRemove(null);
    setIsLogMortalityOpen(false);
    setIsLogHarvestOpen(false);
    setCauseOfDeath('');
    setHarvestData({ hunter: '', method: 'Rifle', trophyMeasurements: '', hornLengthL: '', hornLengthR: '', tipToTipSpread: '', clientId: '', permitId: '', photoUrl: '' });
  };

  const handleLogMortalitySubmit = () => {
    if (animalToRemove) {
      logAnimalMortality(animalToRemove, causeOfDeath);
      handleCloseRemoveModals();
    }
  };

  const handleLogHarvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (animalToRemove) {
      const { hornLengthL, hornLengthR, tipToTipSpread, ...rest } = harvestData;
      
      const finalData: Omit<Harvest, 'id'|'animalTagId'|'species'|'date'|'location'> = { ...rest };

      if(hornLengthL) finalData.hornLengthL = parseFloat(hornLengthL);
      if(hornLengthR) finalData.hornLengthR = parseFloat(hornLengthR);
      if(tipToTipSpread) finalData.tipToTipSpread = parseFloat(tipToTipSpread);
      if(!finalData.clientId) delete finalData.clientId;
      if(!finalData.permitId) delete finalData.permitId;
      if(!finalData.photoUrl) delete finalData.photoUrl;

      logAnimalHarvest(animalToRemove, finalData);
      handleCloseRemoveModals();
    }
  };

  const getValidPermitsForHarvest = (species: string) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      return permits.filter(p => {
          const expiryDate = new Date(p.expiryDate + 'T00:00:00');
          const isExpired = expiryDate < today;
          const speciesMatch = p.linkedSpecies.length === 0 || p.linkedSpecies.includes(species);
          return !isExpired && speciesMatch;
      });
  };

  const handleExport = () => {
    if (activeTab === 'active') {
        const dataToExport = animals.map(({ id, ...rest }) => rest);
        exportToCsv('active_herd_export.csv', dataToExport);
    } else if (activeTab === 'harvest') {
        const dataToExport = harvests.map(h => {
            const clientName = h.clientId ? clients.find(c => c.id === h.clientId)?.name : 'N/A';
            const permitNumber = h.permitId ? permits.find(p => p.id === h.permitId)?.permitNumber : 'N/A';
            return {
                'Date': h.date,
                'Tag ID': h.animalTagId,
                'Species': h.species,
                'Hunter': h.hunter,
                'Client': clientName,
                'Permit #': permitNumber,
                'Method': h.method,
                'Trophy Measurements': h.trophyMeasurements,
                'Location': h.location,
                'Left Horn (in)': h.hornLengthL ?? '',
                'Right Horn (in)': h.hornLengthR ?? '',
                'Tip-to-Tip Spread (in)': h.tipToTipSpread ?? '',
                'Photo URL': h.photoUrl ?? '',
            };
        });
        exportToCsv('harvest_log_export.csv', dataToExport);
    }
  };

  const TabButton: React.FC<{label:string; view: 'active' | 'mortality' | 'harvest'}> = ({label, view}) => (
      <button 
        onClick={() => setActiveTab(view)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === view ? 'bg-white border-b-0 border-t border-x text-brand-primary' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
      >
        {label}
      </button>
  );

  if (viewingProfile) {
    return <AnimalProfile animal={viewingProfile} onBack={() => setViewingProfile(null)} transactions={transactions} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Animal Management</h2>
        <div className="flex items-center gap-4">
            {(activeTab === 'active' || activeTab === 'harvest') && (
                <button
                    onClick={handleExport}
                    className="flex items-center px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
                >
                    <ExportIcon className="w-5 h-5 mr-2" />
                    Export CSV
                </button>
            )}
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Animal
            </button>
        </div>
      </div>

      <div className="-mb-px flex">
          <TabButton label="Active Herd" view="active" />
          <TabButton label="Mortality Register" view="mortality" />
          <TabButton label="Harvest Log" view="harvest" />
      </div>

      <Card className="rounded-t-none">
        <div className="overflow-x-auto">
          {activeTab === 'active' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {animals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <a href="#" onClick={(e) => { e.preventDefault(); setViewingProfile(animal); }} className="text-brand-primary hover:underline">{animal.tagId}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.species}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.sex}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getHealthColor(animal.health)}`}>
                        {animal.health}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><ConditionScore score={animal.conditionScore} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleOpenRemoveConfirmation(animal)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === 'mortality' ? (
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause of Death</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mortalities.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.animalTagId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.species}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hunter / Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permit #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trophy Info</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {harvests.map((h) => {
                  const clientName = h.clientId ? clients.find(c => c.id === h.clientId)?.name : null;
                  const permitNumber = h.permitId ? permits.find(p => p.id === h.permitId)?.permitNumber : 'N/A';
                  return (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.animalTagId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.species}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{h.hunter}</div>
                        {clientName && <div className="text-xs text-gray-400">Client: {clientName}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{permitNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {[
                          h.trophyMeasurements,
                          h.hornLengthL && `L: ${h.hornLengthL}"`,
                          h.hornLengthR && `R: ${h.hornLengthR}"`,
                          h.tipToTipSpread && `Spread: ${h.tipToTipSpread}"`
                        ].filter(Boolean).join(' / ')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Animal">
          <form onSubmit={handleAddAnimal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tagId" className="block text-sm font-medium text-gray-700">Tag ID</label>
                  <input type="text" name="tagId" id="tagId" value={newAnimal.tagId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
                  <input type="text" name="species" id="species" value={newAnimal.species} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                  <input type="number" name="age" id="age" value={newAnimal.age} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
                  <select name="sex" id="sex" value={newAnimal.sex} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                      <option>Female</option>
                      <option>Male</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="health" className="block text-sm font-medium text-gray-700">Health Status</label>
                  <select name="health" id="health" value={newAnimal.health} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                      <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="conditionScore" className="block text-sm font-medium text-gray-700">Condition Score (1-5)</label>
                  <input type="range" min="1" max="5" name="conditionScore" id="conditionScore" value={newAnimal.conditionScore} onChange={handleInputChange} className="mt-1 block w-full" />
                </div>
                {/* FIX: Added form fields for `forageType` and `lsuEquivalent` to be included when adding a new animal. */}
                <div>
                  <label htmlFor="forageType" className="block text-sm font-medium text-gray-700">Forage Type</label>
                  <select name="forageType" id="forageType" value={newAnimal.forageType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                      <option>Mixed-Feeder</option>
                      <option>Grazer</option>
                      <option>Browser</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="lsuEquivalent" className="block text-sm font-medium text-gray-700">LSU Equivalent</label>
                  <input type="number" step="0.01" name="lsuEquivalent" id="lsuEquivalent" value={newAnimal.lsuEquivalent} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
                </div>
                <div className="md:col-span-2">
                   <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                   <select name="location" id="location" value={newAnimal.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                       {habitats.map(h => <option key={h.id}>{h.name}</option>)}
                   </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Add Animal</button>
              </div>
          </form>
      </Modal>

      <Modal isOpen={!!animalToRemove && !isLogMortalityOpen && !isLogHarvestOpen} onClose={handleCloseRemoveModals} title="Remove Animal">
          <p>How would you like to remove animal with Tag ID <strong>{animalToRemove?.tagId}</strong>?</p>
          <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={handleCloseRemoveModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="button" onClick={() => { if(animalToRemove) removeAnimal(animalToRemove.id); handleCloseRemoveModals(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Remove without Log</button>
              <button type="button" onClick={() => setIsLogHarvestOpen(true)} className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-dark">Log Harvest</button>
              <button type="button" onClick={() => setIsLogMortalityOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Log Mortality</button>
          </div>
      </Modal>

      <Modal isOpen={isLogMortalityOpen} onClose={handleCloseRemoveModals} title={`Log Mortality for ${animalToRemove?.tagId}`}>
          <div>
              <label htmlFor="causeOfDeath" className="block text-sm font-medium text-gray-700">Cause of Death</label>
              <input 
                type="text" 
                name="causeOfDeath" 
                id="causeOfDeath" 
                value={causeOfDeath} 
                onChange={(e) => setCauseOfDeath(e.target.value)} 
                placeholder="e.g., Predation, Disease, Old Age"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" 
              />
          </div>
          <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={handleCloseRemoveModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="button" onClick={handleLogMortalitySubmit} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Submit Log</button>
          </div>
      </Modal>

       <Modal isOpen={isLogHarvestOpen} onClose={handleCloseRemoveModals} title={`Log Harvest for ${animalToRemove?.tagId}`}>
          <form onSubmit={handleLogHarvestSubmit} className="space-y-4">
              <div>
                  <label htmlFor="hunter" className="block text-sm font-medium text-gray-700">Hunter Name</label>
                  <input type="text" name="hunter" id="hunter" value={harvestData.hunter} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Link to Client (optional)</label>
                    <select name="clientId" id="clientId" value={harvestData.clientId} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                        <option value="">None</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="permitId" className="block text-sm font-medium text-gray-700">Permit</label>
                    <select name="permitId" id="permitId" value={harvestData.permitId} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                        <option value="">None</option>
                        {animalToRemove && getValidPermitsForHarvest(animalToRemove.species).map(p => <option key={p.id} value={p.id}>{p.permitNumber} ({p.type})</option>)}
                    </select>
                </div>
              </div>
               <div>
                  <label htmlFor="method" className="block text-sm font-medium text-gray-700">Method</label>
                  <select name="method" id="method" value={harvestData.method} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>Rifle</option>
                      <option>Bow</option>
                      <option>Crossbow</option>
                      <option>Other</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="trophyMeasurements" className="block text-sm font-medium text-gray-700">Trophy Info / Score System</label>
                  <input type="text" name="trophyMeasurements" id="trophyMeasurements" value={harvestData.trophyMeasurements} onChange={handleHarvestInputChange} placeholder="e.g., SCI Score, Rowland Ward" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div>
                      <label htmlFor="hornLengthL" className="block text-sm font-medium text-gray-700">Left Horn (in)</label>
                      <input type="number" step="0.1" name="hornLengthL" id="hornLengthL" value={harvestData.hornLengthL} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="hornLengthR" className="block text-sm font-medium text-gray-700">Right Horn (in)</label>
                      <input type="number" step="0.1" name="hornLengthR" id="hornLengthR" value={harvestData.hornLengthR} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="tipToTipSpread" className="block text-sm font-medium text-gray-700">Tip-to-Tip (in)</label>
                      <input type="number" step="0.1" name="tipToTipSpread" id="tipToTipSpread" value={harvestData.tipToTipSpread} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
              </div>
               <div>
                  <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">Photo URL (optional)</label>
                  <input type="url" name="photoUrl" id="photoUrl" value={harvestData.photoUrl} onChange={handleHarvestInputChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={handleCloseRemoveModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Submit Harvest Log</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};
