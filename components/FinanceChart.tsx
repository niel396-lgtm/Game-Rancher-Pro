import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface FinanceChartProps {
  data: Transaction[];
}

export const FinanceChart: React.FC<FinanceChartProps> = ({ data }) => {
  const monthlyData = data.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    // Create a stable, sortable key like "2023-09" for October 2023
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

    if (!acc[key]) {
      acc[key] = {
        key: key,
        name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        Income: 0,
        Expense: 0
      };
    }
    acc[key][transaction.type] += transaction.amount;
    return acc;
  }, {} as Record<string, { key: string; name: string; Income: number; Expense: number }>);

  // Sort by the stable key, not the display name
  const chartData = Object.values(monthlyData).sort((a, b) => a.key.localeCompare(b.key));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Income" fill="#4ade80" />
        <Bar dataKey="Expense" fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  );
};
