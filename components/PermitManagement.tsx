
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Permit } from '../types';
import { PlusIcon } from './ui/Icons';
import { Modal } from './ui/Modal';

interface PermitManagementProps {
  permits: Permit[];
  addPermit: (permit: Omit<Permit, 'id'>) => void;
}

const getStatus = (expiryDate: string): { text: string; color: string } => {
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


export const PermitManagement: React.FC<PermitManagementProps> = ({ permits, addPermit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPermit, setNewPermit] = useState({
    permitNumber: '',
    type: 'Provincial' as Permit['type'],
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    linkedSpecies: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPermit(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPermit.permitNumber || !newPermit.expiryDate) {
      alert("Permit Number and Expiry Date are required.");
      return;
    }
    const { linkedSpecies, ...permitData } = newPermit;
    addPermit({
      ...permitData,
      linkedSpecies: linkedSpecies.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsModalOpen(false);
    setNewPermit({
        permitNumber: '', type: 'Provincial', issueDate: new Date().toISOString().split('T')[0], expiryDate: '', linkedSpecies: '', notes: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Permits & Compliance</h2>
        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Permit
        </button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permit Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Species</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permits.map((permit) => {
                  const status = getStatus(permit.expiryDate);
                  return (
                    <tr key={permit.id} className={'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{permit.permitNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{permit.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{permit.expiryDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{permit.linkedSpecies.join(', ')}</td>
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

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Permit">
          <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label htmlFor="permitNumber" className="block text-sm font-medium text-gray-700">Permit Number</label>
                  <input type="text" name="permitNumber" id="permitNumber" value={newPermit.permitNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
              </div>
               <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Permit Type</label>
                  <select name="type" id="type" value={newPermit.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                      <option>TOPS</option>
                      <option>CITES</option>
                      <option>Provincial</option>
                      <option>Other</option>
                  </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
                    <input type="date" name="issueDate" id="issueDate" value={newPermit.issueDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input type="date" name="expiryDate" id="expiryDate" value={newPermit.expiryDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required/>
                </div>
              </div>
              <div>
                  <label htmlFor="linkedSpecies" className="block text-sm font-medium text-gray-700">Linked Species</label>
                  <input type="text" name="linkedSpecies" id="linkedSpecies" value={newPermit.linkedSpecies} onChange={handleInputChange} placeholder="e.g., Kudu, Impala" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple species with a comma. Leave blank if general.</p>
              </div>
              <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea name="notes" id="notes" value={newPermit.notes} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Save Permit</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};
