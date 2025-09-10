
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Animal } from '../types';

interface SexRatioChartProps {
  data: Animal[];
}

export const SexRatioChart: React.FC<SexRatioChartProps> = ({ data }) => {
  const sexCounts = data.reduce(
    (acc, animal) => {
      if (animal.sex === 'Male') {
        acc.male += 1;
      } else {
        acc.female += 1;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );

  const chartData = [
    { name: 'Sex Ratio', Male: sexCounts.male, Female: sexCounts.female },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" hide />
        <Tooltip />
        <Legend />
        <Bar dataKey="Male" stackId="a" fill="#4A5C3D" />
        <Bar dataKey="Female" stackId="a" fill="#8A9A5B" />
      </BarChart>
    </ResponsiveContainer>
  );
};
