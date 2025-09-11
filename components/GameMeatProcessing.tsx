import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon } from './ui/Icons';
// FIX: Added 'Transaction' to the import from '../types' to resolve the type error.
import { GameMeatProcessing as GameMeatProcessingType, GameMeatSale, Transaction, TransactionType } from '../types';

interface GameMeatProcessingProps {
  processingEntries: GameMeatProcessingType[];
  updateProcessingEntry: (entry: GameMeatProcessingType) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const getStatusColor = (status: GameMeatProcessingType['status']) => {
    const colors = {
        'Awaiting Processing': 'bg-gray-100 text-gray-800',
        'In Process': 'bg-blue-100 text-blue-800',
        'Processed': 'bg-yellow-100 text-yellow-800',
        'Partially Sold': 'bg-purple-100 text-purple-800',
        'Sold': 'bg-green-100 text-green-800',
    };
    return colors[status];
};

export const GameMeatProcessing: React.FC<GameMeatProcessingProps> = ({ processingEntries, updateProcessingEntry, addTransaction }) => {
    const [editingEntry, setEditingEntry] = useState<GameMeatProcessingType | null>(null);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    
    const initialSaleState: Omit<GameMeatSale, 'id'> = {
        buyer: '',
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        weightKg: 0,
        pricePerKg: 0,
        totalPrice: 0,
    };
    const [newSale, setNewSale] = useState(initialSaleState);

    const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingEntry) return;
        const { name, value } = e.target;
        const updatedEntry = { 
            ...editingEntry, 
            [name]: name.includes('Weight') ? parseFloat(value) : value 
        };
        updateProcessingEntry(updatedEntry);
        setEditingEntry(updatedEntry);
    };

    const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedSale = { ...newSale, [name]: value };
        
        if (name === 'weightKg' || name === 'pricePerKg') {
            const weight = name === 'weightKg' ? parseFloat(value) : newSale.weightKg;
            const price = name === 'pricePerKg' ? parseFloat(value) : newSale.pricePerKg;
            updatedSale.totalPrice = weight * price;
        }
        setNewSale(updatedSale);
    };
    
    const handleAddSale = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEntry || newSale.totalPrice <= 0) {
            alert("Invalid sale data.");
            return;
        }

        const saleToAdd: GameMeatSale = { ...newSale, id: `SALE${Date.now()}`};
        
        const remainingWeight = (editingEntry.processedWeightKg || 0) - editingEntry.sales.reduce((sum, s) => sum + s.weightKg, 0);
        const newStatus: GameMeatProcessingType['status'] = (remainingWeight - saleToAdd.weightKg) > 0 ? 'Partially Sold' : 'Sold';

        const updatedEntry = { 
            ...editingEntry,
            sales: [...editingEntry.sales, saleToAdd],
            status: newStatus
        };
        
        updateProcessingEntry(updatedEntry);

        addTransaction({
            date: saleToAdd.date,
            description: `Sale of ${saleToAdd.weightKg}kg ${editingEntry.species} meat to ${saleToAdd.buyer}`,
            category: 'Game Meat Sales',
            amount: saleToAdd.totalPrice,
            type: TransactionType.Income,
        });

        setEditingEntry(updatedEntry);
        setIsSaleModalOpen(false);
        setNewSale(initialSaleState);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Game Meat Processing & Sales</h2>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Animal Tag ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Species</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Carcass Wt. (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Processed Wt. (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {processingEntries.map(entry => (
                                <tr key={entry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setEditingEntry(entry)}>
                                    <td className="px-6 py-4 font-medium">{entry.animalTagId}</td>
                                    <td className="px-6 py-4">{entry.species}</td>
                                    <td className="px-6 py-4">{entry.carcassWeightKg > 0 ? entry.carcassWeightKg : 'N/A'}</td>
                                    <td className="px-6 py-4">{entry.processedWeightKg || 'N/A'}</td>
                                    <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(entry.status)}`}>{entry.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {editingEntry && (
                <Modal isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} title={`Manage Entry for ${editingEntry.animalTagId}`}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Carcass Weight (kg)</label>
                                <input type="number" name="carcassWeightKg" value={editingEntry.carcassWeightKg || ''} onChange={handleEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Processed Weight (kg)</label>
                                <input type="number" name="processedWeightKg" value={editingEntry.processedWeightKg || ''} onChange={handleEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Processing Date</label>
                                <input type="date" name="processingDate" value={editingEntry.processingDate} onChange={handleEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Processed By</label>
                                <input type="text" name="processedBy" value={editingEntry.processedBy} onChange={handleEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select name="status" value={editingEntry.status} onChange={handleEntryChange} className="mt-1 block w-full rounded-md border-gray-300">
                                    {['Awaiting Processing', 'In Process', 'Processed', 'Partially Sold', 'Sold'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold">Sales Log</h4>
                                <button onClick={() => setIsSaleModalOpen(true)} className="flex items-center text-sm px-3 py-1 bg-brand-secondary text-white rounded-lg hover:bg-brand-dark"><PlusIcon className="w-4 h-4 mr-1" /> Add Sale</button>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm">
                                {editingEntry.sales.map(sale => (
                                    <li key={sale.id} className="p-2 bg-gray-50 rounded-md">
                                        Sold {sale.weightKg}kg to <strong>{sale.buyer}</strong> for ${sale.totalPrice.toFixed(2)} on {sale.date}
                                    </li>
                                ))}
                                {editingEntry.sales.length === 0 && <p className="text-gray-500">No sales recorded yet.</p>}
                            </ul>
                        </div>
                    </div>
                </Modal>
            )}
            
            {isSaleModalOpen && (
                <Modal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} title="Log New Meat Sale">
                    <form onSubmit={handleAddSale} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Buyer</label>
                                <input type="text" name="buyer" value={newSale.buyer} onChange={handleSaleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Invoice Number</label>
                                <input type="text" name="invoiceNumber" value={newSale.invoiceNumber} onChange={handleSaleChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Weight (kg)</label>
                                <input type="number" step="0.1" name="weightKg" value={newSale.weightKg} onChange={handleSaleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Price per kg</label>
                                <input type="number" step="0.01" name="pricePerKg" value={newSale.pricePerKg} onChange={handleSaleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                            </div>
                        </div>
                         <div className="p-4 bg-brand-light rounded-lg text-center">
                            <p className="font-medium text-brand-dark">Total Sale Price</p>
                            <p className="text-2xl font-bold text-brand-primary">${newSale.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => setIsSaleModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Log Sale</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};