
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon, TrashIcon } from './ui/Icons';
import { GameMeatProcessing as GameMeatProcessingType, GameMeatSale, Transaction, TransactionType, BatchProduct } from '../types';

interface GameMeatProcessingProps {
  processingEntries: GameMeatProcessingType[];
  updateProcessingEntry: (entry: GameMeatProcessingType) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onViewTraceability: (batchNumber: string) => void;
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

export const GameMeatProcessing: React.FC<GameMeatProcessingProps> = ({ processingEntries, updateProcessingEntry, addTransaction, onViewTraceability }) => {
    const [editingEntry, setEditingEntry] = useState<GameMeatProcessingType | null>(null);
    const [localEntry, setLocalEntry] = useState<GameMeatProcessingType | null>(null);

    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    
    const initialSaleState: Omit<GameMeatSale, 'id' | 'processingBatchNumber'> = {
        buyer: '',
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        weightKg: 0,
        pricePerKg: 0,
        totalPrice: 0,
    };
    const [newSale, setNewSale] = useState(initialSaleState);

    const [newProduct, setNewProduct] = useState({ name: '', weightKg: '' });

    useEffect(() => {
        setLocalEntry(editingEntry ? { ...editingEntry } : null);
    }, [editingEntry]);
    
    const totalProductWeight = useMemo(() => {
        return localEntry?.products.reduce((sum, p) => sum + p.weightKg, 0) || 0;
    }, [localEntry]);

    const handleLocalEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!localEntry) return;
        const { name, value } = e.target;
        setLocalEntry(prev => prev ? { 
            ...prev, 
            [name]: name.includes('Weight') ? parseFloat(value) || 0 : value 
        } : null);
    };

    const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedSale = { ...newSale, [name]: value };
        
        if (name === 'weightKg' || name === 'pricePerKg') {
            const weight = name === 'weightKg' ? parseFloat(value) : newSale.weightKg;
            const price = name === 'pricePerKg' ? parseFloat(value) : newSale.pricePerKg;
            updatedSale.totalPrice = isNaN(weight) || isNaN(price) ? 0 : weight * price;
        }
        setNewSale(updatedSale);
    };

    const handleAddProduct = () => {
        if (!localEntry || !newProduct.name || !newProduct.weightKg) {
            alert("Product name and weight are required.");
            return;
        }
        const weight = parseFloat(newProduct.weightKg);
        if (weight <= 0 || (totalProductWeight + weight) > (localEntry.processedWeightKg || 0)) {
            alert("Invalid weight or total product weight exceeds processed weight.");
            return;
        }
        const product: BatchProduct = { name: newProduct.name, weightKg: weight };
        setLocalEntry(prev => prev ? { ...prev, products: [...prev.products, product] } : null);
        setNewProduct({ name: '', weightKg: '' });
    };

    const handleRemoveProduct = (productName: string) => {
        setLocalEntry(prev => prev ? {
            ...prev,
            products: prev.products.filter(p => p.name !== productName)
        } : null);
    };
    
    const handleAddSale = (e: React.FormEvent) => {
        e.preventDefault();
        if (!localEntry || newSale.totalPrice <= 0) {
            alert("Invalid sale data.");
            return;
        }

        const saleToAdd: GameMeatSale = { 
            ...newSale, 
            id: `SALE${Date.now()}`,
            processingBatchNumber: localEntry.processingBatchNumber,
            weightKg: Number(newSale.weightKg),
            pricePerKg: Number(newSale.pricePerKg)
        };
        
        const remainingWeight = (localEntry.processedWeightKg || 0) - localEntry.sales.reduce((sum, s) => sum + s.weightKg, 0);
        const newStatus: GameMeatProcessingType['status'] = (remainingWeight - saleToAdd.weightKg) > 0 ? 'Partially Sold' : 'Sold';

        const updatedEntry = { 
            ...localEntry,
            sales: [...localEntry.sales, saleToAdd],
            status: newStatus
        };
        
        setLocalEntry(updatedEntry);

        addTransaction({
            date: saleToAdd.date,
            description: `Sale of ${saleToAdd.weightKg}kg ${localEntry.species} meat to ${saleToAdd.buyer}`,
            category: 'Game Meat Sales',
            amount: saleToAdd.totalPrice,
            type: TransactionType.Income,
        });

        setIsSaleModalOpen(false);
        setNewSale(initialSaleState);
    };
    
    const handleSaveAndClose = () => {
        if (localEntry) {
            updateProcessingEntry(localEntry);
        }
        setEditingEntry(null);
    };


    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Game Meat Processing & Sales</h2>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Batch Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Species</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Carcass Wt. (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Processed Wt. (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {processingEntries.map(entry => (
                                <tr key={entry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setEditingEntry(entry)}>
                                    <td className="px-6 py-4 font-medium text-brand-primary">{entry.processingBatchNumber}</td>
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

            {localEntry && (
                <Modal isOpen={!!editingEntry} onClose={handleSaveAndClose} title={`Manage Batch ${localEntry.processingBatchNumber}`}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Carcass Weight (kg)</label>
                                <input type="number" name="carcassWeightKg" value={localEntry.carcassWeightKg || ''} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Processed Weight (kg)</label>
                                <input type="number" name="processedWeightKg" value={localEntry.processedWeightKg || ''} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Processing Date</label>
                                <input type="date" name="processingDate" value={localEntry.processingDate} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Processed By</label>
                                <input type="text" name="processedBy" value={localEntry.processedBy} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Abattoir Name</label>
                                <input type="text" name="abattoirName" value={localEntry.abattoirName || ''} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Health Inspection Cert. URL</label>
                                <input type="url" name="healthInspectionCertUrl" value={localEntry.healthInspectionCertUrl || ''} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300" placeholder="https://..."/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Status</label>
                                <select name="status" value={localEntry.status} onChange={handleLocalEntryChange} className="mt-1 block w-full rounded-md border-gray-300">
                                    {['Awaiting Processing', 'In Process', 'Processed', 'Partially Sold', 'Sold'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {localEntry.processedWeightKg && localEntry.processedWeightKg > 0 && (
                            <div className="pt-4 border-t">
                                <h4 className="text-lg font-semibold">Batch Products</h4>
                                <p className="text-sm text-gray-500">Log the products created from this batch. These will be added to your inventory.</p>
                                <div className="mt-2 text-right font-medium text-brand-dark">
                                    {totalProductWeight.toFixed(2)} kg / {localEntry.processedWeightKg.toFixed(2)} kg used
                                </div>
                                <div className="space-y-2 mt-2">
                                    {localEntry.products.map(p => (
                                        <div key={p.name} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                            <span>{p.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{p.weightKg} kg</span>
                                                <button onClick={() => handleRemoveProduct(p.name)} className="text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-end gap-2 mt-2">
                                    <div className="flex-grow"><label className="text-xs">Product Name</label><input type="text" value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} className="w-full p-1 border rounded" /></div>
                                    <div className="w-24"><label className="text-xs">Weight (kg)</label><input type="number" step="0.1" value={newProduct.weightKg} onChange={e => setNewProduct(p => ({...p, weightKg: e.target.value}))} className="w-full p-1 border rounded" /></div>
                                    <button type="button" onClick={handleAddProduct} className="px-3 py-1 bg-brand-secondary text-white rounded hover:bg-brand-dark"><PlusIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold">Sales Log</h4>
                                <button onClick={() => setIsSaleModalOpen(true)} className="flex items-center text-sm px-3 py-1 bg-brand-secondary text-white rounded-lg hover:bg-brand-dark"><PlusIcon className="w-4 h-4 mr-1" /> Add Sale</button>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm">
                                {localEntry.sales.map(sale => (
                                    <li key={sale.id} className="p-2 bg-gray-50 rounded-md">
                                        Sold {sale.weightKg}kg to <strong>{sale.buyer}</strong> for ${sale.totalPrice.toFixed(2)} on {sale.date}
                                    </li>
                                ))}
                                {localEntry.sales.length === 0 && <p className="text-gray-500">No sales recorded yet.</p>}
                            </ul>
                        </div>
                        
                        {localEntry.processingBatchNumber && (
                            <div className="pt-4 border-t">
                                <h4 className="text-lg font-semibold">Traceability</h4>
                                <div className="flex items-center gap-4 mt-2">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(`https://example.com/trace/${localEntry.processingBatchNumber}`)}`} 
                                        alt="Traceability QR Code"
                                        className="w-32 h-32 border p-1"
                                    />
                                    <div>
                                        <p className="text-sm text-gray-600">Scan this code to view public traceability information for this batch.</p>
                                        <button
                                            type="button"
                                            onClick={() => onViewTraceability(localEntry.processingBatchNumber)}
                                            className="mt-2 px-3 py-1 bg-brand-secondary text-white rounded-lg text-sm hover:bg-brand-dark"
                                        >
                                            Simulate Scan & View Page
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
