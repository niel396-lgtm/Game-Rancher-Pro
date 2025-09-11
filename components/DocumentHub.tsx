import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon, DocumentIcon } from './ui/Icons';
import { OfficialDocument, Client, ProfessionalHunter, Hunt } from '../types';

interface DocumentHubProps {
  documents: OfficialDocument[];
  addDocument: (doc: Omit<OfficialDocument, 'id'>) => void;
  clients: Client[];
  professionalHunters: ProfessionalHunter[];
  hunts: Hunt[];
}

const getStatus = (expiryDate?: string): { text: string; color: string } => {
    if (!expiryDate) {
        return { text: 'No Expiry', color: 'bg-gray-100 text-gray-800' };
    }
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

export const DocumentHub: React.FC<DocumentHubProps> = ({ documents, addDocument, clients, professionalHunters, hunts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initialFormState = {
        fileName: '',
        category: 'Other' as OfficialDocument['category'],
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        fileUrl: '',
        linkedClientId: '',
        linkedPhId: '',
        linkedHuntId: '',
        notes: ''
    };
    const [newDoc, setNewDoc] = useState(initialFormState);

    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c.name])), [clients]);
    const phMap = useMemo(() => new Map(professionalHunters.map(ph => [ph.id, ph.name])), [professionalHunters]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewDoc(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDoc.fileName || !newDoc.fileUrl) {
            alert('File Name and File URL are required.');
            return;
        }
        addDocument({
            ...newDoc,
            expiryDate: newDoc.expiryDate || undefined,
            linkedClientId: newDoc.linkedClientId || undefined,
            linkedPhId: newDoc.linkedPhId || undefined,
            linkedHuntId: newDoc.linkedHuntId || undefined,
            notes: newDoc.notes || undefined
        });
        setIsModalOpen(false);
        setNewDoc(initialFormState);
    };
    
    const getLinkName = (doc: OfficialDocument) => {
        if (doc.linkedClientId) return `Client: ${clientMap.get(doc.linkedClientId)}`;
        if (doc.linkedPhId) return `PH: ${phMap.get(doc.linkedPhId)}`;
        if (doc.linkedHuntId) {
            const hunt = hunts.find(h => h.id === doc.linkedHuntId);
            if (hunt) return `Hunt: ${clientMap.get(hunt.clientId)} (${hunt.startDate})`;
        }
        return 'General';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Document Hub</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Document
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linked To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {documents.map(doc => {
                                const status = getStatus(doc.expiryDate);
                                return (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center">
                                                <DocumentIcon className="w-5 h-5 mr-2" />
                                                {doc.fileName}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">{doc.category}</td>
                                        <td className="px-6 py-4">{getLinkName(doc)}</td>
                                        <td className="px-6 py-4">{doc.expiryDate || 'N/A'}</td>
                                        <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>{status.text}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Document">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">File Name</label>
                        <input type="text" name="fileName" value={newDoc.fileName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">File URL</label>
                        <input type="url" name="fileUrl" placeholder="https://example.com/document.pdf" value={newDoc.fileUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Category</label>
                            <select name="category" value={newDoc.category} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option>Indemnity</option><option>Insurance</option><option>Firearm Permit</option><option>CITES Permit</option><option>Veterinary</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Expiry Date (Optional)</label>
                            <input type="date" name="expiryDate" value={newDoc.expiryDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" />
                        </div>
                     </div>
                     <h4 className="text-md font-semibold text-gray-600 pt-4 border-t">Optional Links</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-medium">Link to Client</label>
                            <select name="linkedClientId" value={newDoc.linkedClientId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option value="">None</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Link to PH</label>
                            <select name="linkedPhId" value={newDoc.linkedPhId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option value="">None</option>
                                {professionalHunters.map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Link to Hunt</label>
                            <select name="linkedHuntId" value={newDoc.linkedHuntId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option value="">None</option>
                                {hunts.map(h => <option key={h.id} value={h.id}>{`${clientMap.get(h.clientId)} - ${h.startDate}`}</option>)}
                            </select>
                        </div>
                     </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Save Document</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};