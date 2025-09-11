import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon } from './ui/Icons';
import { VeterinaryLog as VeterinaryLogType, HealthProtocol, Animal } from '../types';

interface VeterinaryLogProps {
    veterinaryLogs: VeterinaryLogType[];
    addVeterinaryLog: (log: Omit<VeterinaryLogType, 'id'>) => void;
    healthProtocols: HealthProtocol[];
    addHealthProtocol: (protocol: Omit<HealthProtocol, 'id'>) => void;
    animals: Animal[];
}

const TabButton: React.FC<{label:string; view: 'log' | 'protocols'; activeTab: string; setActiveTab: (tab: 'log' | 'protocols') => void}> = ({label, view, activeTab, setActiveTab}) => (
    <button 
      onClick={() => setActiveTab(view)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === view ? 'bg-white border-b-0 border-t border-x text-brand-primary' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
    >
      {label}
    </button>
);

export const VeterinaryLog: React.FC<VeterinaryLogProps> = ({ veterinaryLogs, addVeterinaryLog, healthProtocols, addHealthProtocol, animals }) => {
    const [activeTab, setActiveTab] = useState<'log' | 'protocols'>('log');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);

    const initialLogState = {
        date: new Date().toISOString().split('T')[0],
        animalId: '',
        species: '',
        procedure: 'Check-up' as VeterinaryLogType['procedure'],
        diagnosis: '',
        medicationUsed: '',
        vetName: '',
        notes: ''
    };
    const [newLog, setNewLog] = useState(initialLogState);

    const initialProtocolState = {
        name: '',
        species: 'All',
        procedure: '',
        frequency: 'Annually' as HealthProtocol['frequency'],
        dueMonth: 'January'
    };
    const [newProtocol, setNewProtocol] = useState(initialProtocolState);
    
    const speciesList = useMemo(() => ['All', ...Array.from(new Set(animals.map(a => a.species))).sort()], [animals]);

    const handleLogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({ ...prev, [name]: value }));
    };

    const handleProtocolChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProtocol(prev => ({ ...prev, [name]: value }));
    };

    const handleLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addVeterinaryLog({
            ...newLog,
            animalId: newLog.animalId || undefined,
            species: newLog.species || undefined,
            diagnosis: newLog.diagnosis || undefined,
            medicationUsed: newLog.medicationUsed || undefined,
            vetName: newLog.vetName || undefined,
            notes: newLog.notes || undefined,
        });
        setIsLogModalOpen(false);
        setNewLog(initialLogState);
    };

    const handleProtocolSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newProtocol.name || !newProtocol.procedure) {
            alert("Protocol Name and Procedure are required.");
            return;
        }
        addHealthProtocol(newProtocol);
        setIsProtocolModalOpen(false);
        setNewProtocol(initialProtocolState);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Veterinary Management</h2>
                <button
                    onClick={() => activeTab === 'log' ? setIsLogModalOpen(true) : setIsProtocolModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {activeTab === 'log' ? 'Add Log Entry' : 'Add Health Protocol'}
                </button>
            </div>
            
            <div className="-mb-px flex">
                <TabButton label="Veterinary Log" view="log" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton label="Health Protocols" view="protocols" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <Card className="rounded-t-none">
                 {activeTab === 'log' ? (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal/Species</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vet Name</th>
                                </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {veterinaryLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{log.date}</td>
                                        <td className="px-6 py-4 font-medium">{log.animalId ? `Animal: ${animals.find(a => a.id === log.animalId)?.tagId}` : `Herd: ${log.species}`}</td>
                                        <td className="px-6 py-4">{log.procedure}</td>
                                        <td className="px-6 py-4">{log.medicationUsed || 'N/A'}</td>
                                        <td className="px-6 py-4">{log.vetName || 'N/A'}</td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                     </div>
                 ) : (
                     <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Protocol Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Month</th>
                                </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {healthProtocols.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{p.name}</td>
                                        <td className="px-6 py-4">{p.species}</td>
                                        <td className="px-6 py-4">{p.procedure}</td>
                                        <td className="px-6 py-4">{p.frequency}</td>
                                        <td className="px-6 py-4">{p.dueMonth}</td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                     </div>
                 )}
            </Card>

            <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Add Veterinary Log Entry">
                 <form onSubmit={handleLogSubmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Date</label>
                            <input type="date" name="date" value={newLog.date} onChange={handleLogChange} className="mt-1 block w-full rounded-md border-gray-300" required/>
                        </div>
                        <div>
                             <label className="block text-sm font-medium">Procedure</label>
                            <select name="procedure" value={newLog.procedure} onChange={handleLogChange} className="mt-1 block w-full rounded-md border-gray-300">
                                {['Check-up', 'Vaccination', 'Deworming', 'Disease Testing', 'Treatment', 'Immobilization', 'Translocation'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                     </div>
                     <p className="text-sm text-gray-500">Apply to individual animal OR entire species herd.</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Individual Animal (Optional)</label>
                            <select name="animalId" value={newLog.animalId} onChange={handleLogChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option value="">Select Animal...</option>
                                {animals.map(a => <option key={a.id} value={a.id}>{a.tagId} ({a.species})</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Species / Herd (Optional)</label>
                             <select name="species" value={newLog.species} onChange={handleLogChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option value="">Select Species...</option>
                                {speciesList.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium">Medication Used</label>
                            <input type="text" name="medicationUsed" value={newLog.medicationUsed} onChange={handleLogChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Veterinarian</label>
                            <input type="text" name="vetName" value={newLog.vetName} onChange={handleLogChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                        </div>
                     </div>
                      <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Save Entry</button>
                    </div>
                 </form>
            </Modal>
            
            <Modal isOpen={isProtocolModalOpen} onClose={() => setIsProtocolModalOpen(false)} title="Add Health Protocol">
                 <form onSubmit={handleProtocolSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium">Protocol Name</label>
                        <input type="text" name="name" placeholder="e.g., Annual Buffalo Vaccinations" value={newProtocol.name} onChange={handleProtocolChange} className="mt-1 block w-full rounded-md border-gray-300" required/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Target Species</label>
                            <select name="species" value={newProtocol.species} onChange={handleProtocolChange} className="mt-1 block w-full rounded-md border-gray-300">
                               {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Frequency</label>
                            <select name="frequency" value={newProtocol.frequency} onChange={handleProtocolChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option>Annually</option><option>Bi-Annually</option><option>Quarterly</option>
                            </select>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium">Procedure</label>
                        <input type="text" name="procedure" placeholder="e.g., Vaccinate for Anthrax, Botulism" value={newProtocol.procedure} onChange={handleProtocolChange} className="mt-1 block w-full rounded-md border-gray-300" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Due Month</label>
                        <select name="dueMonth" value={newProtocol.dueMonth} onChange={handleProtocolChange} className="mt-1 block w-full rounded-md border-gray-300">
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsProtocolModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Save Protocol</button>
                    </div>
                 </form>
            </Modal>

        </div>
    );
};