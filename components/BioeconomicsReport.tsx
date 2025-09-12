import React, { useMemo } from 'react';
import { Card } from './ui/Card';
import { Transaction, PopulationSurvey, Animal, TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BioeconomicsReportProps {
    transactions: Transaction[];
    populationSurveys: PopulationSurvey[];
    animals: Animal[];
}

export const BioeconomicsReport: React.FC<BioeconomicsReportProps> = ({ transactions, populationSurveys, animals }) => {
    
    const speciesData = useMemo(() => {
        const speciesList = Array.from(new Set(animals.map(a => a.species)));
        
        return speciesList.map(species => {
            const latestSurvey = populationSurveys
                .filter(s => s.species === species)
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            const population = latestSurvey ? latestSurvey.estimatedCount : 0;

            const income = transactions
                .filter(t => t.type === TransactionType.Income && (t.linkedSpecies === species || animals.find(a => a.id === t.linkedAnimalId)?.species === species))
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter(t => t.type === TransactionType.Expense && (t.linkedSpecies === species || animals.find(a => a.id === t.linkedAnimalId)?.species === species))
                .reduce((sum, t) => sum + t.amount, 0);
            
            const netValue = income - expense;
            const valuePerAnimal = population > 0 ? netValue / population : 0;

            return {
                name: species,
                population,
                income,
                expense,
                netValue,
                valuePerAnimal,
            };
        }).sort((a, b) => b.netValue - a.netValue);

    }, [transactions, populationSurveys, animals]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Bio-Economics Report</h2>
            <Card>
                <p className="mb-6 text-gray-600 text-sm">This report analyzes the financial performance of each species relative to its population size, providing insights into the economic efficiency of your wildlife assets.</p>

                <div className="h-96 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={speciesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="netValue" fill="#8884d8" name="Net Value ($)" />
                            <Bar yAxisId="right" dataKey="population" fill="#82ca9d" name="Population" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Est. Population</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Income</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Expense</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Value</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value per Animal</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {speciesData.map(s => (
                                <tr key={s.name} className="odd:bg-gray-50 hover:bg-gray-100/75">
                                    <td className="px-6 py-4 font-medium text-sm">{s.name}</td>
                                    <td className="px-6 py-4 text-right text-sm">{s.population}</td>
                                    <td className="px-6 py-4 text-right text-green-600 text-sm">${s.income.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-red-600 text-sm">${s.expense.toLocaleString()}</td>
                                    <td className={`px-6 py-4 text-right font-semibold text-sm ${s.netValue >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        ${s.netValue.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-sm ${s.valuePerAnimal >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                                        ${s.valuePerAnimal.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
