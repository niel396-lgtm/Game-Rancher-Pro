
import React, { useState, useMemo } from 'react';
import { Animal, Transaction, TransactionType, ReproductiveEvent, AnimalMeasurement } from '../types';
import { Card } from './ui/Card';
import { PlusIcon, StarIcon } from './ui/Icons';

interface AnimalProfileProps {
  animal: Animal;
  onBack: () => void;
  transactions: Transaction[];
  animals: Animal[];
  reproductiveEvents: ReproductiveEvent[];
  animalMeasurements: AnimalMeasurement[];
  addAnimalMeasurement: (measurement: Omit<AnimalMeasurement, 'id'>) => void;
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

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-lg font-semibold text-brand-dark">{value}</div>
    </div>
);

const PedigreeChart: React.FC<{animal: Animal, allAnimals: Animal[]}> = ({ animal, allAnimals }) => {
    const animalMap = new Map(allAnimals.map(a => [a.id, a]));

    const getParent = (id?: string) => id ? animalMap.get(id) : undefined;

    const sire = getParent(animal.sireId);
    const dam = getParent(animal.damId);

    const paternalGrandsire = sire ? getParent(sire.sireId) : undefined;
    const paternalGranddam = sire ? getParent(sire.damId) : undefined;

    const maternalGrandsire = dam ? getParent(dam.sireId) : undefined;
    const maternalGranddam = dam ? getParent(dam.damId) : undefined;

    const Node: React.FC<{ a?: Animal, role: string, gender: 'male' | 'female' | 'neutral' }> = ({ a, role, gender }) => {
        const bgColor = gender === 'male' ? 'bg-blue-50' : gender === 'female' ? 'bg-pink-50' : 'bg-gray-100';
        const borderColor = gender === 'male' ? 'border-blue-200' : gender === 'female' ? 'border-pink-200' : 'border-gray-200';
        return (
            <div className={`p-2 rounded-md border ${bgColor} ${borderColor}`}>
                <p className="text-xs font-semibold text-gray-500">{role}</p>
                <p className="text-sm font-bold text-brand-dark">{a?.tagId || 'Unknown'}</p>
                {a && <p className="text-xs text-gray-500">{a.species}</p>}
            </div>
        );
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            {/* Generation 3: Grandparents */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <Node a={paternalGrandsire} role="Grandsire" gender="male" />
                    <Node a={paternalGranddam} role="Granddam" gender="female" />
                </div>
                <div className="flex flex-col space-y-2">
                    <Node a={maternalGrandsire} role="Grandsire" gender="male" />
                    <Node a={maternalGranddam} role="Granddam" gender="female" />
                </div>
            </div>
            {/* Generation 2: Parents */}
            <div className="flex flex-col justify-around">
                <Node a={sire} role="Sire" gender="male" />
                <Node a={dam} role="Dam" gender="female" />
            </div>
            {/* Generation 1: Animal */}
            <div className="flex items-center">
                 <Node a={animal} role="Subject" gender="neutral" />
            </div>
        </div>
    );
};


export const AnimalProfile: React.FC<AnimalProfileProps> = ({ animal, onBack, transactions, animals, reproductiveEvents, animalMeasurements, addAnimalMeasurement }) => {
    const animalTransactions = transactions
        .filter(t => t.linkedAnimalId === animal.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const sire = animals.find(a => a.id === animal.sireId);
    const dam = animals.find(a => a.id === animal.damId);

    const lifetimeInvestment = useMemo(() => {
        return transactions
            .filter(t => t.linkedAnimalId === animal.id && t.type === TransactionType.Expense)
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions, animal.id]);

    const offspringEvents = reproductiveEvents.filter(e => e.damTagId === animal.tagId || e.sireTagId === animal.tagId)
        .sort((a, b) => new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime());
        
    const measurements = animalMeasurements.filter(m => m.animalId === animal.id);

    const initialMeasurementState = {
        date: new Date().toISOString().split('T')[0],
        measurementType: 'Horn Length (L)' as AnimalMeasurement['measurementType'],
        value: 0,
        unit: 'in' as AnimalMeasurement['unit'],
        notes: ''
    };
    const [newMeasurement, setNewMeasurement] = useState(initialMeasurementState);

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedMeasurement = {
            ...newMeasurement,
            [name]: name === 'value' ? parseFloat(value) : value
        };
        if(name === 'measurementType' && value === 'Body Weight') {
            updatedMeasurement.unit = 'kg';
        } else if (name === 'measurementType' && value !== 'Body Weight') {
            updatedMeasurement.unit = 'in';
        }
        setNewMeasurement(updatedMeasurement);
    };

    const handleMeasurementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newMeasurement.value <= 0) {
            alert("Please enter a valid measurement value.");
            return;
        }
        addAnimalMeasurement({ ...newMeasurement, animalId: animal.id });
        setNewMeasurement(initialMeasurementState);
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-brand-dark">{animal.species}</h2>
            <p className="text-lg text-gray-600">Tag ID: {animal.tagId}</p>
        </div>
        <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
            &larr; Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card title="Primary Details">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <DetailItem label="Age" value={`${animal.age} years`} />
                    <DetailItem label="Sex" value={animal.sex} />
                    <DetailItem label="Category" value={animal.category} />
                    <DetailItem label="Current Location" value={animal.location} />
                    <DetailItem label="Sire" value={sire ? sire.tagId : 'Unknown'} />
                    <DetailItem label="Dam" value={dam ? dam.tagId : 'Unknown'} />
                    <DetailItem label="Forage Type" value={animal.forageType} />
                    <DetailItem label="Lifetime Investment" value={`$${lifetimeInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                </div>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card title="Health & Condition">
                <div className="space-y-4">
                     <div>
                        <p className="text-sm text-gray-500">Health Status</p>
                        <span className={`px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full ${getHealthColor(animal.health)}`}>
                            {animal.health}
                          </span>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Condition Score</p>
                        <ConditionScore score={animal.conditionScore} />
                    </div>
                </div>
            </Card>
        </div>
      </div>
       <div className="mt-6">
            <Card title="Pedigree">
                <PedigreeChart animal={animal} allAnimals={animals} />
            </Card>
       </div>
       <div className="mt-6">
           <Card title="Growth & Quality Metrics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">Log New Measurement</h4>
                        <form onSubmit={handleMeasurementSubmit} className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600">Date</label>
                                    <input type="date" name="date" value={newMeasurement.date} onChange={handleMeasurementChange} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm" required />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600">Type</label>
                                    <select name="measurementType" value={newMeasurement.measurementType} onChange={handleMeasurementChange} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm">
                                        <option>Horn Length (L)</option>
                                        <option>Horn Length (R)</option>
                                        <option>Tip-to-Tip Spread</option>
                                        <option>Body Weight</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600">Value ({newMeasurement.unit})</label>
                                <input type="number" name="value" step="0.1" value={newMeasurement.value} onChange={handleMeasurementChange} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm" required />
                            </div>
                             <div>
                                <label className="text-xs font-medium text-gray-600">Notes</label>
                                <textarea name="notes" value={newMeasurement.notes} onChange={handleMeasurementChange} rows={2} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <button type="submit" className="w-full flex justify-center items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow text-sm">
                                <PlusIcon className="w-4 h-4 mr-2" /> Log Measurement
                            </button>
                        </form>
                    </div>
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">Measurement History</h4>
                        {measurements.length > 0 ? (
                           <div className="overflow-y-auto max-h-72 border rounded-lg">
                             <table className="min-w-full divide-y divide-gray-200 text-sm">
                               <thead className="bg-gray-50 sticky top-0">
                                 <tr>
                                   <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Date</th>
                                   <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Type</th>
                                   <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase">Value</th>
                                 </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200">
                                 {measurements.map((m) => (
                                   <tr key={m.id}>
                                     <td className="px-4 py-2 whitespace-nowrap text-gray-600">{m.date}</td>
                                     <td className="px-4 py-2 whitespace-nowrap text-gray-800 font-medium">{m.measurementType}</td>
                                     <td className="px-4 py-2 whitespace-nowrap text-right text-gray-600">{m.value} {m.unit}</td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         ) : (
                           <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                                <p className="text-gray-500 text-sm">No measurements recorded.</p>
                           </div>
                         )}
                    </div>
                </div>
           </Card>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card title="Reproductive History">
                {offspringEvents.length > 0 ? (
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offspring Tag</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {offspringEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.birthDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{event.offspringTagId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.sex}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No reproductive history recorded for this animal.</p>
                )}
            </Card>
           <Card title="Financial History">
                {animalTransactions.length > 0 ? (
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {animalTransactions.map((t) => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.description}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>
                              {t.type === TransactionType.Income ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No financial history recorded for this animal.</p>
                )}
            </Card>
       </div>

    </div>
  );
};
