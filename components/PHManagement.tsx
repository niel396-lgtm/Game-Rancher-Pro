import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon } from './ui/Icons';
import { ProfessionalHunter } from '../types';

interface PHManagementProps {
    professionalHunters: ProfessionalHunter[];
    addProfessionalHunter: (ph: Omit<ProfessionalHunter, 'id'>) => void;
}

const getLicenseStatus = (expiryDate: string): { text: string; color: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);

    if (expiry < today) {
        return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(today.getDate() + 60);

    if (expiry <= sixtyDaysFromNow) {
        return { text: 'Expires Soon', color: 'bg-yellow-100 text-yellow-800' };
    }

    return { text: 'Active', color: 'bg-green-100 text-green-800' };
};


export const PHManagement: React.FC<PHManagementProps> = ({ professionalHunters, addProfessionalHunter }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initialFormState = {
        name: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        provincialEndorsements: ''
    };
    const [newPH, setNewPH] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPH(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPH.name || !newPH.licenseNumber || !newPH.licenseExpiryDate) {
            alert("Name, License Number, and Expiry Date are required.");
            return;
        }
        addProfessionalHunter({
            ...newPH,
            provincialEndorsements: newPH.provincialEndorsements.split(',').map(s => s.trim()).filter(Boolean)
        });
        setIsModalOpen(false);
        setNewPH(initialFormState);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Professional Hunter Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add PH
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endorsements</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {professionalHunters.map(ph => {
                                const status = getLicenseStatus(ph.licenseExpiryDate);
                                return (
                                    <tr key={ph.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{ph.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{ph.licenseNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{ph.licenseExpiryDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ph.provincialEndorsements.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Professional Hunter">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={newPH.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">License Number</label>
                        <input type="text" name="licenseNumber" value={newPH.licenseNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
                        <input type="date" name="licenseExpiryDate" value={newPH.licenseExpiryDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Provincial Endorsements</label>
                        <input type="text" name="provincialEndorsements" value={newPH.provincialEndorsements} onChange={handleInputChange} placeholder="e.g., Limpopo, Free State" className="mt-1 block w-full rounded-md border-gray-300" />
                         <p className="text-xs text-gray-500 mt-1">Separate multiple provinces with a comma.</p>
                    </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Add Hunter</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
