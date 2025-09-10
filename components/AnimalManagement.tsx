
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Animal, HabitatZone, Mortality } from '../types';
import { PlusIcon, TrashIcon, StarIcon } from './ui/Icons';
import { Modal } from './ui/Modal';

interface AnimalManagementProps {
  animals: Animal[];
  habitats: HabitatZone[];
  addAnimal: (animal: Omit<Animal, 'id'>) => void;
  removeAnimal: (id: string) => void;
  mortalities: Mortality[];
  logAnimalMortality: (animal: Animal, cause: string) => void;
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


export const AnimalManagement: React.FC<AnimalManagementProps> = ({ animals, habitats, addAnimal, removeAnimal, mortalities, logAnimalMortality }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'mortality'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [animalToRemove, setAnimalToRemove] = useState<Animal | null>(null);
  const [isLogMortalityOpen, setIsLogMortalityOpen] = useState(false);
  const [causeOfDeath, setCauseOfDeath] = useState('');

  const [newAnimal, setNewAnimal] = useState({
      tagId: '', species: '', age: 0, sex: 'Female' as 'Male'|'Female', health: 'Good' as Animal['health'], conditionScore: 3, location: habitats[0]?.name || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewAnimal(prev => ({ ...prev, [name]: name === 'age' || name === 'conditionScore' ? parseInt(value, 10) : value }));
  };

  const handleAddAnimal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newAnimal.tagId || !newAnimal.species || newAnimal.age <= 0) {
          alert('Please fill all required fields');
          return;
      }
      addAnimal(newAnimal);
      setIsAddModalOpen(false);
      setNewAnimal({ tagId: '', species: '', age: 0, sex: 'Female', health: 'Good', conditionScore: 3, location: habitats[0]?.name || '' });
  };
  
  const handleOpenRemoveConfirmation = (animal: Animal) => {
    setAnimalToRemove(animal);
  };

  const handleCloseRemoveModals = () => {
    setAnimalToRemove(null);
    setIsLogMortalityOpen(false);
    setCauseOfDeath('');
  };

  const handleLogMortalitySubmit = () => {
    if (animalToRemove) {
      logAnimalMortality(animalToRemove, causeOfDeath);
      handleCloseRemoveModals();
    }
  };

  const TabButton: React.FC<{label:string; view: 'active' | 'mortality'}> = ({label, view}) => (
      <button 
        onClick={() => setActiveTab(view)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === view ? 'bg-white border-b-0 border-t border-x text-brand-primary' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
      >
        {label}
      </button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Animal Management</h2>
        <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Animal
        </button>
      </div>

      <div className="-mb-px flex">
          <TabButton label="Active Herd" view="active" />
          <TabButton label="Mortality Register" view="mortality" />
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{animal.tagId}</td>
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
          ) : (
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

      <Modal isOpen={!!animalToRemove && !isLogMortalityOpen} onClose={handleCloseRemoveModals} title="Remove Animal">
          <p>How would you like to remove animal with Tag ID <strong>{animalToRemove?.tagId}</strong>?</p>
          <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={handleCloseRemoveModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="button" onClick={() => { if(animalToRemove) removeAnimal(animalToRemove.id); handleCloseRemoveModals(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Remove without Log</button>
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
    </div>
  );
};
