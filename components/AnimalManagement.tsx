
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Animal, HabitatZone, Mortality, Harvest, Transaction, Client, Permit, ReproductiveEvent, AnimalMeasurement, ProfessionalHunter, Coords } from '../types';
import { PlusIcon, TrashIcon, StarIcon, ExportIcon, TrophyIcon } from './ui/Icons';
import { Modal } from './ui/Modal';
import { AnimalProfile } from './AnimalProfile';
import { SCICalculator } from './SCICalculator';
import { SCI_FORMULAS } from '../constants';
import { LocationPickerMap } from './LocationPickerMap';


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
  reproductiveEvents: ReproductiveEvent[];
  logReproductiveEvent: (event: Omit<ReproductiveEvent, 'id'>) => void;
  animalMeasurements: AnimalMeasurement[];
  addAnimalMeasurement: (measurement: Omit<AnimalMeasurement, 'id'>) => void;
  professionalHunters: ProfessionalHunter[];
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


export const AnimalManagement: React.FC<AnimalManagementProps> = ({ animals, habitats, addAnimal, removeAnimal, mortalities, logAnimalMortality, harvests, logAnimalHarvest, transactions, clients, permits, reproductiveEvents, logReproductiveEvent, animalMeasurements, addAnimalMeasurement, professionalHunters }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'mortality' | 'harvest' | 'reproduction'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [animalToRemove, setAnimalToRemove] = useState<Animal | null>(null);
  const [isLogMortalityOpen, setIsLogMortalityOpen] = useState(false);
  const [causeOfDeath, setCauseOfDeath] = useState('');
  
  const [isLogHarvestOpen, setIsLogHarvestOpen] = useState(false);
  const [harvestData, setHarvestData] = useState({ 
    professionalHunterId: '', method: 'Rifle', trophyMeasurements: '', hornLengthL: '', hornLengthR: '', tipToTipSpread: '', baseCircumferenceL: '', baseCircumferenceR: '', clientId: '', photoUrl: '', coordinates: null as Coords | null
  });
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);


  const [isLogBirthOpen, setIsLogBirthOpen] = useState(false);
  const initialBirthState = {
      damId: '', sireId: '', offspringTagId: '', birthDate: new Date().toISOString().split('T')[0], sex: 'Female' as 'Male'|'Female', health: 'Good' as Animal['health'], conditionScore: 3, notes: ''
  };
  const [newBirth, setNewBirth] = useState(initialBirthState);

  const [viewingProfile, setViewingProfile] = useState<Animal | null>(null);
  const [isSciCalculatorOpen, setIsSciCalculatorOpen] = useState(false);

  const [newAnimal, setNewAnimal] = useState({
      tagId: '', species: '', age: 0, sex: 'Female' as 'Male'|'Female', health: 'Good' as Animal['health'], conditionScore: 3, location: habitats[0]?.name || '', forageType: 'Mixed-Feeder' as Animal['forageType'], lsuEquivalent: 0.5, sireId: '', damId: '', category: 'Production' as Animal['category']
  });

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
      const finalAnimal: Omit<Animal, 'id'> = {
          ...newAnimal,
          lsuConsumptionRate: newAnimal.lsuEquivalent * 3650,
      };
      if (!finalAnimal.sireId) delete finalAnimal.sireId;
      if (!finalAnimal.damId) delete finalAnimal.damId;
      
      addAnimal(finalAnimal);
      setIsAddModalOpen(false);
      setNewAnimal({ tagId: '', species: '', age: 0, sex: 'Female', health: 'Good', conditionScore: 3, location: habitats[0]?.name || '', forageType: 'Mixed-Feeder', lsuEquivalent: 0.5, sireId: '', damId: '', category: 'Production' });
  };
  
  const handleOpenRemoveConfirmation = (animal: Animal) => {
    setAnimalToRemove(animal);
  };

  const handleCloseRemoveModals = () => {
    setAnimalToRemove(null);
    setIsLogMortalityOpen(false);
    setIsLogHarvestOpen(false);
    setCauseOfDeath('');
    setHarvestData({ professionalHunterId: '', method: 'Rifle', trophyMeasurements: '', hornLengthL: '', hornLengthR: '', tipToTipSpread: '', baseCircumferenceL: '', baseCircumferenceR: '', clientId: '', photoUrl: '', coordinates: null });
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
      const { hornLengthL, hornLengthR, tipToTipSpread, baseCircumferenceL, baseCircumferenceR, ...rest } = harvestData;
      
      const finalData: Omit<Harvest, 'id'|'animalTagId'|'species'|'date'|'location'> = { ...rest };

      if(hornLengthL) finalData.hornLengthL = parseFloat(hornLengthL);
      if(hornLengthR) finalData.hornLengthR = parseFloat(hornLengthR);
      if(tipToTipSpread) finalData.tipToTipSpread = parseFloat(tipToTipSpread);
      if(baseCircumferenceL) finalData.baseCircumferenceL = parseFloat(baseCircumferenceL);
      if(baseCircumferenceR) finalData.baseCircumferenceR = parseFloat(baseCircumferenceR);

      if(!finalData.clientId) delete finalData.clientId;
      if(!finalData.photoUrl) delete finalData.photoUrl;
      if(!finalData.coordinates) delete finalData.coordinates;

      logAnimalHarvest(animalToRemove, finalData);
      handleCloseRemoveModals();
    }
  };

  const handleExport = () => {
    if (activeTab === 'active') {
        const dataToExport = animals.map(({ id, ...rest }) => rest);
        exportToCsv('active_herd_export.csv', dataToExport);
    } else if (activeTab === 'harvest') {
        const dataToExport = harvests.map(h => {
            const clientName = h.clientId ? clients.find(c => c.id === h.clientId)?.name : 'N/A';
            const phName = professionalHunters.find(ph => ph.id === h.professionalHunterId)?.name || 'N/A';
            return {
                'Date': h.date, 'Tag ID': h.animalTagId, 'Species': h.species, 'Professional Hunter': phName, 'Client': clientName, 'Method': h.method, 'Trophy Measurements': h.trophyMeasurements, 'Location': h.location, 'GPS': h.coordinates ? `${h.coordinates[0]}, ${h.coordinates[1]}`: '', 'Left Horn (in)': h.hornLengthL ?? '', 'Right Horn (in)': h.hornLengthR ?? '', 'Base (L)': h.baseCircumferenceL ?? '', 'Base (R)': h.baseCircumferenceR ?? '', 'Tip-to-Tip Spread (in)': h.tipToTipSpread ?? '', 'Photo URL': h.photoUrl ?? '',
            };
        });
        exportToCsv('harvest_log_export.csv', dataToExport);
    }
  };
  
  const handleBirthInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBirth(prev => ({ ...prev, [name]: name === 'conditionScore' ? parseInt(value, 10) : value }));
  };

  const handleLogBirthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dam = animals.find(a => a.id === newBirth.damId);
    if (!dam || !newBirth.offspringTagId) {
      alert("A valid Dam and Offspring Tag ID are required.");
      return;
    }

    const newAnimalForAdd: Omit<Animal, 'id'> = {
        tagId: newBirth.offspringTagId,
        species: dam.species,
        age: 0,
        sex: newBirth.sex,
        health: newBirth.health,
        conditionScore: newBirth.conditionScore,
        location: dam.location,
        forageType: dam.forageType,
        lsuEquivalent: dam.lsuEquivalent,
        lsuConsumptionRate: dam.lsuEquivalent * 3650,
        damId: dam.id,
        sireId: newBirth.sireId || undefined,
        category: 'Juvenile'
    };
    addAnimal(newAnimalForAdd);

    const newReproEvent: Omit<ReproductiveEvent, 'id'> = {
        offspringTagId: newBirth.offspringTagId,
        damTagId: dam.tagId,
        sireTagId: animals.find(a => a.id === newBirth.sireId)?.tagId,
        birthDate: newBirth.birthDate,
        sex: newBirth.sex,
        notes: newBirth.notes,
    };
    logReproductiveEvent(newReproEvent);
    
    setIsLogBirthOpen(false);
    setNewBirth(initialBirthState);
  };
  
  const handleApplySciScore = (score: string, measurements: Record<string, number>) => {
    setHarvestData(prev => ({
        ...prev,
        trophyMeasurements: score,
        hornLengthL: measurements.hornLengthL?.toString() || prev.hornLengthL,
        hornLengthR: measurements.hornLengthR?.toString() || prev.hornLengthR,
        baseCircumferenceL: measurements.baseCircumferenceL?.toString() || prev.baseCircumferenceL,
        baseCircumferenceR: measurements.baseCircumferenceR?.toString() || prev.baseCircumferenceR,
    }));
    setIsSciCalculatorOpen(false);
  };

  const TabButton: React.FC<{label:string; view: 'active' | 'mortality' | 'harvest' | 'reproduction'}> = ({label, view}) => (
      <button 
        onClick={() => setActiveTab(view)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === view ? 'bg-white border-b-0 border-t border-x text-brand-primary' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
      >
        {label}
      </button>
  );

  if (viewingProfile) {
    return <AnimalProfile 
        animal={viewingProfile} 
        onBack={() => setViewingProfile(null)} 
        transactions={transactions} 
        animals={animals} 
        reproductiveEvents={reproductiveEvents} 
        animalMeasurements={animalMeasurements}
        addAnimalMeasurement={addAnimalMeasurement}
    />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Animal Management</h2>
        <div className="flex items-center gap-4">
            {(activeTab === 'active' || activeTab === 'harvest') && (
                <button onClick={handleExport} className="flex items-center px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow">
                    <ExportIcon className="w-5 h-5 mr-2" /> Export CSV
                </button>
            )}
            {activeTab === 'reproduction' && (
                 <button onClick={() => setIsLogBirthOpen(true)} className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow">
                    <PlusIcon className="w-5 h-5 mr-2" /> Log Birth Event
                </button>
            )}
             {activeTab === 'active' && (
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow">
                    <PlusIcon className="w-5 h-5 mr-2" /> Add Animal
                </button>
             )}
        </div>
      </div>

      <div className="-mb-px flex">
          <TabButton label="Active Herd" view="active" />
          <TabButton label="Reproduction" view="reproduction" />
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
          ) : activeTab === 'reproduction' ? (
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offspring Tag ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dam Tag ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sire Tag ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reproductiveEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.birthDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.offspringTagId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.sex}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.damTagId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.sireTagId || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{event.notes}</td>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PH / Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trophy Info</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {harvests.map((h) => {
                  const clientName = h.clientId ? clients.find(c => c.id === h.clientId)?.name : null;
                  const phName = professionalHunters.find(ph => ph.id === h.professionalHunterId)?.name;
                  return (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.animalTagId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.species}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{phName || 'N/A'}</div>
                        {clientName && <div className="text-xs text-gray-400">Client: {clientName}</div>}
                      </td>
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
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Animal (Acquisition)">
          <form onSubmit={handleAddAnimal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tagId" className="block text-sm font-medium text-gray-700">Tag ID</label>
                  <input type="text" name="tagId" id="tagId" value={newAnimal.tagId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
                  <input type="text" name="species" id="species" value={newAnimal.species} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                  <input type="number" name="age" id="age" value={newAnimal.age} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
                  <select name="sex" id="sex" value={newAnimal.sex} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>Female</option> <option>Male</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Management Category</label>
                  <select name="category" id="category" value={newAnimal.category} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>Production</option>
                      <option>Breeding Stock</option>
                      <option>Trophy</option>
                      <option>Juvenile</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="health" className="block text-sm font-medium text-gray-700">Health Status</label>
                  <select name="health" id="health" value={newAnimal.health} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                  </select>
                </div>
                 <div className="md:col-span-2">
                  <label htmlFor="conditionScore" className="block text-sm font-medium text-gray-700">Condition Score ({newAnimal.conditionScore}/5)</label>
                  <input type="range" min="1" max="5" name="conditionScore" id="conditionScore" value={newAnimal.conditionScore} onChange={handleInputChange} className="mt-1 block w-full" />
                </div>
                <div>
                  <label htmlFor="forageType" className="block text-sm font-medium text-gray-700">Forage Type</label>
                  <select name="forageType" id="forageType" value={newAnimal.forageType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>Mixed-Feeder</option> <option>Grazer</option> <option>Browser</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="lsuEquivalent" className="block text-sm font-medium text-gray-700">LSU Equivalent</label>
                  <input type="number" step="0.01" name="lsuEquivalent" id="lsuEquivalent" value={newAnimal.lsuEquivalent} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                </div>
                <div className="md:col-span-2">
                   <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                   <select name="location" id="location" value={newAnimal.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                       {habitats.map(h => <option key={h.id}>{h.name}</option>)}
                   </select>
                </div>
                <div className="md:col-span-2 pt-2 border-t">
                  <h4 className="text-sm font-medium text-gray-500">Known Lineage (Optional)</h4>
                </div>
                <div>
                  <label htmlFor="damId" className="block text-sm font-medium text-gray-700">Dam (Mother)</label>
                  <select name="damId" id="damId" value={newAnimal.damId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option value="">Unknown</option>
                      {animals.filter(a => a.sex === 'Female').map(a => <option key={a.id} value={a.id}>{a.tagId} ({a.species})</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="sireId" className="block text-sm font-medium text-gray-700">Sire (Father)</label>
                  <select name="sireId" id="sireId" value={newAnimal.sireId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option value="">Unknown</option>
                      {animals.filter(a => a.sex === 'Male').map(a => <option key={a.id} value={a.id}>{a.tagId} ({a.species})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Add Animal</button>
              </div>
          </form>
      </Modal>

      <Modal isOpen={isLogBirthOpen} onClose={() => setIsLogBirthOpen(false)} title="Log New Birth Event">
          <form onSubmit={handleLogBirthSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="damId" className="block text-sm font-medium text-gray-700">Dam (Mother)</label>
                      <select name="damId" id="damId" value={newBirth.damId} onChange={handleBirthInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required>
                          <option value="">Select Dam...</option>
                          {animals.filter(a => a.sex === 'Female').map(a => <option key={a.id} value={a.id}>{a.tagId} ({a.species})</option>)}
                      </select>
                  </div>
                   <div>
                      <label htmlFor="sireId" className="block text-sm font-medium text-gray-700">Sire (Father)</label>
                      <select name="sireId" id="sireId" value={newBirth.sireId} onChange={handleBirthInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                          <option value="">Unknown / Multiple</option>
                          {animals.filter(a => a.sex === 'Male').map(a => <option key={a.id} value={a.id}>{a.tagId} ({a.species})</option>)}
                      </select>
                  </div>
              </div>
              <h4 className="text-md font-semibold text-gray-600 pt-4 border-t">Offspring Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="offspringTagId" className="block text-sm font-medium text-gray-700">Offspring Tag ID</label>
                      <input type="text" name="offspringTagId" id="offspringTagId" value={newBirth.offspringTagId} onChange={handleBirthInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                  </div>
                  <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
                      <input type="date" name="birthDate" id="birthDate" value={newBirth.birthDate} onChange={handleBirthInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                  </div>
                  <div>
                      <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
                      <select name="sex" id="sex" value={newBirth.sex} onChange={handleBirthInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                          <option>Female</option><option>Male</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="health" className="block text-sm font-medium text-gray-700">Initial Health</label>
                      <select name="health" id="health" value={newBirth.health} onChange={handleBirthInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                          <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                      </select>
                  </div>
                   <div className="md:col-span-2">
                      <label htmlFor="conditionScore" className="block text-sm font-medium text-gray-700">Initial Condition ({newBirth.conditionScore}/5)</label>
                      <input type="range" min="1" max="5" name="conditionScore" id="conditionScore" value={newBirth.conditionScore} onChange={handleBirthInputChange} className="mt-1 block w-full" />
                  </div>
                   <div className="md:col-span-2">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea name="notes" id="notes" value={newBirth.notes} onChange={handleBirthInputChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
              </div>
               <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setIsLogBirthOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Log Birth</button>
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
              <input type="text" name="causeOfDeath" id="causeOfDeath" value={causeOfDeath} onChange={(e) => setCauseOfDeath(e.target.value)} placeholder="e.g., Predation, Disease, Old Age" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={handleCloseRemoveModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="button" onClick={handleLogMortalitySubmit} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Submit Log</button>
          </div>
      </Modal>

       <Modal isOpen={isLogHarvestOpen} onClose={handleCloseRemoveModals} title={`Log Harvest for ${animalToRemove?.tagId}`}>
          <form onSubmit={handleLogHarvestSubmit} className="space-y-4">
              <div>
                  <label htmlFor="professionalHunterId" className="block text-sm font-medium text-gray-700">Professional Hunter</label>
                  <select name="professionalHunterId" id="professionalHunterId" value={harvestData.professionalHunterId} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required>
                      <option value="">Select PH...</option>
                      {professionalHunters.map(ph => <option key={ph.id} value={ph.id}>{ph.name} - {ph.licenseNumber}</option>)}
                  </select>
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
                  <label htmlFor="method" className="block text-sm font-medium text-gray-700">Method</label>
                  <select name="method" id="method" value={harvestData.method} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>Rifle</option> <option>Bow</option> <option>Crossbow</option> <option>Other</option>
                  </select>
              </div>
              </div>
               <div>
                  <label htmlFor="trophyMeasurements" className="block text-sm font-medium text-gray-700">Trophy Info / Score</label>
                  <div className="flex items-center gap-2">
                    <input type="text" name="trophyMeasurements" id="trophyMeasurements" value={harvestData.trophyMeasurements} onChange={handleHarvestInputChange} placeholder="e.g., SCI Score: 135 3/8" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    {animalToRemove && SCI_FORMULAS[animalToRemove.species] && (
                        <button type="button" onClick={() => setIsSciCalculatorOpen(true)} className="mt-1 px-3 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-dark whitespace-nowrap">
                            <TrophyIcon className="w-5 h-5 inline-block mr-1"/>
                             SCI Calc
                        </button>
                    )}
                  </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div>
                      <label htmlFor="hornLengthL" className="block text-sm font-medium text-gray-700">Left Horn (in)</label>
                      <input type="number" step="0.1" name="hornLengthL" id="hornLengthL" value={harvestData.hornLengthL} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="hornLengthR" className="block text-sm font-medium text-gray-700">Right Horn (in)</label>
                      <input type="number" step="0.1" name="hornLengthR" id="hornLengthR" value={harvestData.hornLengthR} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="baseCircumferenceL" className="block text-sm font-medium text-gray-700">Base (L)</label>
                      <input type="number" step="0.1" name="baseCircumferenceL" id="baseCircumferenceL" value={harvestData.baseCircumferenceL} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="baseCircumferenceR" className="block text-sm font-medium text-gray-700">Base (R)</label>
                      <input type="number" step="0.1" name="baseCircumferenceR" id="baseCircumferenceR" value={harvestData.baseCircumferenceR} onChange={handleHarvestInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Harvest Coordinates</label>
                <div className="mt-1 flex items-center gap-4">
                    <p className="flex-grow p-2 bg-gray-100 rounded-md text-sm">
                        {harvestData.coordinates ? `Lat: ${harvestData.coordinates[0].toFixed(5)}, Lng: ${harvestData.coordinates[1].toFixed(5)}` : "Not set"}
                    </p>
                    <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-dark">Set on Map</button>
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

      {animalToRemove && (
        <SCICalculator 
            isOpen={isSciCalculatorOpen}
            onClose={() => setIsSciCalculatorOpen(false)}
            species={animalToRemove.species}
            onApply={handleApplySciScore}
            initialMeasurements={{
                hornLengthL: parseFloat(harvestData.hornLengthL) || 0,
                hornLengthR: parseFloat(harvestData.hornLengthR) || 0,
                baseCircumferenceL: parseFloat(harvestData.baseCircumferenceL) || 0,
                baseCircumferenceR: parseFloat(harvestData.baseCircumferenceR) || 0,
            }}
        />
      )}
        <LocationPickerMap 
            isOpen={isLocationPickerOpen}
            onClose={() => setIsLocationPickerOpen(false)}
            onLocationSelect={(coords) => setHarvestData(prev => ({ ...prev, coordinates: coords }))}
            initialCenter={[30.51, -98.39]}
        />
    </div>
  );
};
