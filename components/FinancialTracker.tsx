
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Transaction, TransactionType, Animal, HabitatZone, InventoryItem } from '../types';
import { FinanceChart } from './FinanceChart';
import { Modal } from './ui/Modal';
import { PlusIcon } from './ui/Icons';

interface FinancialTrackerProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  animals: Animal[];
  habitats: HabitatZone[];
  inventory: InventoryItem[];
}

export const FinancialTracker: React.FC<FinancialTrackerProps> = ({ transactions, addTransaction, animals, habitats, inventory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFormState = {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: 0,
      type: TransactionType.Expense,
      linkedAnimalId: '',
      linkedHabitatId: '',
      linkedInventoryId: ''
  };
  const [newTransaction, setNewTransaction] = useState(initialFormState);

  const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewTransaction(prev => ({
          ...prev,
          [name]: name === 'amount' ? parseFloat(value) || 0 : value
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTransaction.description || newTransaction.amount <= 0) {
          alert("Please fill in a description and a valid amount.");
          return;
      }
      
      const { linkedAnimalId, linkedHabitatId, linkedInventoryId, ...transactionData } = newTransaction;

      const finalTransaction: Omit<Transaction, 'id'> = {
        ...transactionData,
        amount: Number(transactionData.amount)
      };

      if (linkedAnimalId) finalTransaction.linkedAnimalId = linkedAnimalId;
      if (linkedHabitatId) finalTransaction.linkedHabitatId = linkedHabitatId;
      if (linkedInventoryId) finalTransaction.linkedInventoryId = linkedInventoryId;

      addTransaction(finalTransaction);
      setNewTransaction(initialFormState);
      setIsModalOpen(false);
  };
  
  const getLinkedItemName = (transaction: Transaction): string | null => {
      if (transaction.linkedAnimalId) {
          const animal = animals.find(a => a.id === transaction.linkedAnimalId);
          return animal ? `Animal: ${animal.tagId}` : null;
      }
      if (transaction.linkedHabitatId) {
          const habitat = habitats.find(h => h.id === transaction.linkedHabitatId);
          return habitat ? `Habitat: ${habitat.name}` : null;
      }
      if (transaction.linkedInventoryId) {
          const item = inventory.find(i => i.id === transaction.linkedInventoryId);
          return item ? `Inventory: ${item.name}` : null;
      }
      return null;
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Financial Tracker</h2>
        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Transaction
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Total Income" className="text-center bg-green-50">
            <p className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
        </Card>
        <Card title="Total Expense" className="text-center bg-red-50">
            <p className="text-3xl font-bold text-red-600">${totalExpense.toLocaleString()}</p>
        </Card>
        <Card title="Net Balance" className="text-center bg-blue-50">
            <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${netBalance.toLocaleString()}
            </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Transaction History">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {t.description}
                       {getLinkedItemName(t) && (
                          <span className="block text-xs text-gray-500 italic">{getLinkedItemName(t)}</span>
                      )}
                    </td>
                    <td className={`px-4 py-2 whitespace-nowrap text-sm text-right font-semibold ${t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === TransactionType.Income ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Monthly Summary">
            <div className="h-96">
                <FinanceChart data={transactions} />
            </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={newTransaction.date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" id="type" value={newTransaction.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                        <option value={TransactionType.Expense}>Expense</option>
                        <option value={TransactionType.Income}>Income</option>
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" name="description" id="description" value={newTransaction.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input type="text" name="category" id="category" value={newTransaction.category} onChange={handleInputChange} placeholder="e.g., Feed, Vet, Sales" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" name="amount" id="amount" value={newTransaction.amount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required min="0.01" step="0.01" />
                </div>
            </div>
            
            <h4 className="text-md font-semibold text-gray-600 pt-4 border-t">Optional Links</h4>
            <div className="space-y-2">
                 <div>
                    <label htmlFor="linkedAnimalId" className="block text-sm font-medium text-gray-700">Link to Animal</label>
                    <select name="linkedAnimalId" id="linkedAnimalId" value={newTransaction.linkedAnimalId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                        <option value="">None</option>
                        {animals.map(animal => <option key={animal.id} value={animal.id}>{animal.tagId} - {animal.species}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="linkedHabitatId" className="block text-sm font-medium text-gray-700">Link to Habitat</label>
                    <select name="linkedHabitatId" id="linkedHabitatId" value={newTransaction.linkedHabitatId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                        <option value="">None</option>
                        {habitats.map(habitat => <option key={habitat.id} value={habitat.id}>{habitat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="linkedInventoryId" className="block text-sm font-medium text-gray-700">Link to Inventory</label>
                    <select name="linkedInventoryId" id="linkedInventoryId" value={newTransaction.linkedInventoryId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
                        <option value="">None</option>
                        {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Add Transaction</button>
            </div>
        </form>
      </Modal>

    </div>
  );
};