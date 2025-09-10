import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Client, Harvest } from '../types';
import { PlusIcon } from './ui/Icons';
import { Modal } from './ui/Modal';
import { ClientProfile } from './ClientProfile';

interface ClientManagementProps {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  harvests: Harvest[];
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ clients, addClient, harvests }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    visitDates: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) {
      alert("Client name is required.");
      return;
    }
    const { visitDates, ...clientData } = newClient;
    addClient({
      ...clientData,
      visitDates: visitDates.split(',').map(d => d.trim()).filter(Boolean)
    });
    setIsModalOpen(false);
    setNewClient({ name: '', email: '', phone: '', visitDates: '' });
  };

  if (viewingProfile) {
    return <ClientProfile client={viewingProfile} harvests={harvests} onBack={() => setViewingProfile(null)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Client Management</h2>
        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Client
        </button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit History</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                  <tr key={client.id} className={'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                       <a href="#" onClick={(e) => { e.preventDefault(); setViewingProfile(client); }} className="text-brand-primary hover:underline">
                        {client.name}
                       </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{client.email}</div>
                      <div>{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.visitDates.join(', ')}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="name" id="name" value={newClient.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
              </div>
               <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" name="email" id="email" value={newClient.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" name="phone" id="phone" value={newClient.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div>
                  <label htmlFor="visitDates" className="block text-sm font-medium text-gray-700">Visit Dates</label>
                  <input type="text" name="visitDates" id="visitDates" value={newClient.visitDates} onChange={handleInputChange} placeholder="e.g., 2024-05-10 to 2024-05-15" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple date ranges with a comma.</p>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Add Client</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};