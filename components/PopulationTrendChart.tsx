import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PopulationSurvey } from '../types';

interface PopulationTrendChartProps {
  surveys: PopulationSurvey[];
  species: string;
}

export const PopulationTrendChart: React.FC<PopulationTrendChartProps> = ({ surveys, species }) => {
  const chartData = surveys
    .filter(s => s.species === species)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
        date: new Date(s.date).toLocaleDateString('default', { month: 'short', year: '2-digit' }),
        count: s.estimatedCount,
    }));

  if (chartData.length < 2) {
      return <div className="flex items-center justify-center h-full text-gray-500">Not enough survey data to display a trend for {species}.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" name={`${species} Population`} stroke="#4A5C3D" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
