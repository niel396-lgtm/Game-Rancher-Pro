
import React from 'react';
import { Card } from './ui/Card';
import { Transaction, TransactionType } from '../types';
import { FinanceChart } from './FinanceChart';

interface FinancialTrackerProps {
  transactions: Transaction[];
}

export const FinancialTracker: React.FC<FinancialTrackerProps> = ({ transactions }) => {
  const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Financial Tracker</h2>
      
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
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{t.description}</td>
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

    </div>
  );
};
