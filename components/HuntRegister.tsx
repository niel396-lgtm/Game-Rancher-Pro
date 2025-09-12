import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon, ExportIcon } from './ui/Icons';
import { Hunt, Client, ProfessionalHunter, Permit, Harvest } from '../types';

interface HuntRegisterProps {
    hunts: Hunt[];
    clients: Client[];
    professionalHunters: ProfessionalHunter[];
    permits: Permit[];
    addHunt: (hunt: Omit<Hunt, 'id'>) => void;
    updateHunt: (hunt: Hunt) => void;
    harvests: Harvest[];
}

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

const HuntStatusBadge: React.FC<{ status: Hunt['status'] }> = ({ status }) => {
    const styles = {
        Planned: 'bg-blue-100 text-blue-800',
        Active: 'bg-green-100 text-green-800',
        Completed: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const getPermitStatus = (expiryDate: string): { text: string; color: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    if (expiry < today) return { text: 'Expired', color: '' };
    return { text: 'Active', color: '' };
};

const getPHStatus = (expiryDate: string): { text: string; color: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    if (expiry < today) return { text: 'Expired', color: '' };
    return { text: 'Active', color: '' };
};

export const HuntRegister: React.FC<HuntRegisterProps> = ({ hunts, clients, professionalHunters, permits, addHunt, updateHunt, harvests }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingHunt, setEditingHunt] = useState<Hunt | null>(null);

    const initialFormState = {
        clientId: '',
        professionalHunterId: '',
        permitIds: [] as string[],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Planned' as Hunt['status'],
        notes: ''
    };
    const [newHunt, setNewHunt] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewHunt(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePermitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setNewHunt(prev => ({ ...prev, permitIds: selectedOptions }));
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHunt.clientId || !newHunt.professionalHunterId || !newHunt.startDate || !newHunt.endDate) {
            alert("Client, PH, and dates are required.");
            return;
        }
        addHunt({
            ...newHunt,
            ranchId: 'RANCH01',
            checklist: {
                indemnitySigned: false,
                firearmPermitVerified: false,
                provincialLicenseAcquired: false,
            }
        });
        setIsAddModalOpen(false);
        setNewHunt(initialFormState);
    };
    
    const handleChecklistChange = (hunt: Hunt, key: keyof Hunt['checklist']) => {
        const updatedHunt = {
            ...hunt,
            checklist: {
                ...hunt.checklist,
                [key]: !(hunt.checklist as any)[key]
            }
        };
        updateHunt(updatedHunt);
        setEditingHunt(updatedHunt);
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingHunt) return;
        const updatedHunt = {
            ...editingHunt,
            checklist: { ...editingHunt.checklist, indemnityPdfUrl: e.target.value }
        };
        updateHunt(updatedHunt);
        setEditingHunt(updatedHunt);
    }

    const handleStatusChange = (hunt: Hunt, newStatus: Hunt['status']) => {
        // Check if status is changing TO 'Completed'
        if (hunt.status !== 'Completed' && newStatus === 'Completed') {
            const client = clients.find(c => c.id === hunt.clientId);
            const ph = professionalHunters.find(p => p.id === hunt.professionalHunterId);
            if (client && client.email) {
                console.log(`SIMULATION: Sending one-time review request link to ${client.email} for hunt ID ${hunt.id}. This review will cover both the ranch and the PH, ${ph?.name}.`);
                // UI feedback for the user
                alert(`A review request has been sent to ${client.name} (${client.email}).`);
            } else if (client) {
                alert(`Could not send review request: Client ${client.name} does not have an email address on file.`);
            }
        }
    
        const updatedHunt = {
            ...hunt,
            status: newStatus,
        };
        updateHunt(updatedHunt);
        setEditingHunt(updatedHunt); // Keep modal open with updated data
    };

    const handleExportRegister = () => {
        const sortedHarvests = [...harvests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        const dataToExport = sortedHarvests.map(h => {
            const client = h.clientId ? clients.find(c => c.id === h.clientId) : null;
            const ph = professionalHunters.find(p => p.id === h.professionalHunterId);
            
            return {
                'Date': h.date,
                'Farm Name': h.farmName,
                'Farm Owner': h.farmOwner,
                'Client Name': client?.name || 'N/A',
                'Client Contact': client?.phone || client?.email || 'N/A',
                'PH Name': ph?.name || 'N/A',
                'PH License': ph?.licenseNumber || 'N/A',
                'Species': h.species,
                'Sex': h.sex,
                'Trophy Measurements': h.trophyMeasurements,
                'Witness': h.witness || 'N/A',
                'Client Signature URL': h.clientSignature || 'N/A',
                'PH Signature URL': h.phSignature || 'N/A',
            };
        });
        
        if(dataToExport.length > 0) {
            exportToCsv('ph_hunting_register.csv', dataToExport);
        } else {
            alert("No harvest data available to export.");
        }
    };
    
    const clientMap = new Map(clients.map(c => [c.id, c.name]));
    const phMap = new Map(professionalHunters.map(ph => [ph.id, ph.name]));
    const permitMap = new Map(permits.map(p => [p.id, p.permitNumber]));

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Digital Hunt Register</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExportRegister}
                        className="flex items-center px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-brand-dark"
                    >
                        <ExportIcon className="w-5 h-5 mr-2" />
                        Export PH Register
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Plan New Hunt
                    </button>
                </div>
            </div>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professional Hunter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permit(s)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {hunts.map(hunt => (
                                 <tr key={hunt.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setEditingHunt(hunt)}>
                                     <td className="px-6 py-4 font-medium">{clientMap.get(hunt.clientId) || 'Unknown Client'}</td>
                                     <td className="px-6 py-4">{phMap.get(hunt.professionalHunterId) || 'Unknown PH'}</td>
                                     <td className="px-6 py-4">{hunt.startDate} to {hunt.endDate}</td>
                                     <td className="px-6 py-4">{hunt.permitIds.map(id => permitMap.get(id)).join(', ')}</td>
                                     <td className="px-6 py-4"><HuntStatusBadge status={hunt.status} /></td>
                                 </tr>
                             ))}
                         </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Hunt Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Plan a New Hunt">
                 <form onSubmit={handleAddSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium">Client</label>
                            <select name="clientId" value={newHunt.clientId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required>
                                <option value="">Select Client...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Professional Hunter</label>
                            <select name="professionalHunterId" value={newHunt.professionalHunterId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required>
                                <option value="">Select PH...</option>
                                {professionalHunters.filter(ph => getPHStatus(ph.licenseExpiryDate).text === 'Active').map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Start Date</label>
                            <input type="date" name="startDate" value={newHunt.startDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">End Date</label>
                            <input type="date" name="endDate" value={newHunt.endDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                        </div>
                     </div>
                      <div>
                        <label className="block text-sm font-medium">Permits (multi-select with Ctrl/Cmd)</label>
                        <select name="permitIds" value={newHunt.permitIds} onChange={handlePermitChange} multiple className="mt-1 block w-full rounded-md border-gray-300 h-24">
                            {permits.filter(p => getPermitStatus(p.expiryDate).text !== 'Expired').map(p => <option key={p.id} value={p.id}>{p.permitNumber} ({p.type})</option>)}
                        </select>
                    </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Create Hunt</button>
                    </div>
                 </form>
            </Modal>
            
             {/* Edit Hunt Checklist Modal */}
            {editingHunt && (
                <Modal isOpen={!!editingHunt} onClose={() => setEditingHunt(null)} title={`Manage Hunt for ${clientMap.get(editingHunt.clientId)}`}>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-brand-dark">Compliance Checklist</h3>
                         <div className="space-y-3">
                            <label className="flex items-center">
                                <input type="checkbox" checked={editingHunt.checklist.indemnitySigned} onChange={() => handleChecklistChange(editingHunt!, 'indemnitySigned')} className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"/>
                                <span className="ml-3 text-gray-700">Client Indemnity Form Signed</span>
                            </label>
                            {editingHunt.checklist.indemnitySigned && (
                                <div className="pl-8">
                                    <label className="text-sm font-medium">Indemnity PDF URL</label>
                                    <input type="url" placeholder="Paste URL to scanned PDF..." value={editingHunt.checklist.indemnityPdfUrl || ''} onChange={handleUrlChange} className="mt-1 block w-full text-sm rounded-md border-gray-300"/>
                                </div>
                            )}
                             <label className="flex items-center">
                                <input type="checkbox" checked={editingHunt.checklist.firearmPermitVerified} onChange={() => handleChecklistChange(editingHunt!, 'firearmPermitVerified')} className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"/>
                                <span className="ml-3 text-gray-700">Firearm Import Permit Verified (if applicable)</span>
                            </label>
                             <label className="flex items-center">
                                <input type="checkbox" checked={editingHunt.checklist.provincialLicenseAcquired} onChange={() => handleChecklistChange(editingHunt!, 'provincialLicenseAcquired')} className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"/>
                                <span className="ml-3 text-gray-700">Provincial Hunting License Acquired</span>
                            </label>
                         </div>
                         <div className="mt-4 pt-4 border-t">
                            <label htmlFor="hunt-status" className="block text-lg font-semibold text-brand-dark mb-2">Hunt Status</label>
                            <select
                                id="hunt-status"
                                value={editingHunt.status}
                                onChange={(e) => handleStatusChange(editingHunt, e.target.value as Hunt['status'])}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm"
                            >
                                <option value="Planned">Planned</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};