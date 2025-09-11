import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { PopulationTrendChart } from './PopulationTrendChart';
import { Transaction, PopulationSurvey, Harvest, Animal, ReproductiveEvent, TransactionType } from '../types';
import { calculateStrategicQuota } from '../services/harvestPlanningService';
import { SPECIES_PARAMETERS } from '../constants';

interface AnnualReportProps {
    transactions: Transaction[];
    populationSurveys: PopulationSurvey[];
    harvests: Harvest[];
    animals: Animal[];
    reproductiveEvents: ReproductiveEvent[];
}

const CONSERVATION_EXPENSE_CATEGORIES = ['Veterinary', 'Maintenance', 'Feed'];
const HUNTING_INCOME_CATEGORIES = ['Leases', 'Sales', 'Services'];

export const AnnualReport: React.FC<AnnualReportProps> = ({ transactions, populationSurveys, harvests, animals }) => {
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        transactions.forEach(t => years.add(new Date(t.date).getFullYear()));
        harvests.forEach(h => years.add(new Date(h.date).getFullYear()));
        populationSurveys.forEach(s => years.add(new Date(s.date).getFullYear()));
        if (years.size === 0) years.add(new Date().getFullYear());
        return Array.from(years).sort((a, b) => b - a);
    }, [transactions, harvests, populationSurveys]);
    
    const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

    const reportData = useMemo(() => {
        if (!selectedYear) return null;

        const yearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);
        const yearHarvests = harvests.filter(h => new Date(h.date).getFullYear() === selectedYear);

        const huntingIncome = yearTransactions
            .filter(t => t.type === TransactionType.Income && HUNTING_INCOME_CATEGORIES.includes(t.category))
            .reduce((sum, t) => sum + t.amount, 0);

        const conservationExpense = yearTransactions
            .filter(t => t.type === TransactionType.Expense && CONSERVATION_EXPENSE_CATEGORIES.includes(t.category))
            .reduce((sum, t) => sum + t.amount, 0);

        const speciesForReport = Array.from(new Set(populationSurveys.map(s => s.species)));
        
        const offtakeAnalysis = speciesForReport.map(species => {
            const latestSurvey = populationSurveys
                .filter(s => s.species === species && new Date(s.date).getFullYear() <= selectedYear)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            
            if (!latestSurvey) return null;

            const speciesParams = (SPECIES_PARAMETERS as any)[species];
            const growthRate = speciesParams ? speciesParams.growthRateLambda : 1.1; // Default growth rate
            
            const recommendedQuota = calculateStrategicQuota(latestSurvey, latestSurvey.estimatedCount, growthRate, 1, 3);
            const actualHarvests = yearHarvests.filter(h => h.species === species).length;
            
            return {
                species,
                recommended: recommendedQuota.total,
                actual: actualHarvests
            };
        }).filter(Boolean);

        return {
            huntingIncome,
            conservationExpense,
            offtakeAnalysis,
            speciesForReport
        };

    }, [selectedYear, transactions, harvests, populationSurveys]);

    return (
        <div className="print-container">
            <div className="flex justify-between items-center mb-6 no-print">
                <h2 className="text-3xl font-bold text-brand-dark">Annual Report</h2>
                <div className="flex items-center gap-4">
                     <div>
                        <label htmlFor="year-select" className="mr-2 font-medium">Report Year:</label>
                        <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="p-2 border rounded-md shadow-sm">
                            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow">
                        Print Report
                    </button>
                </div>
            </div>
            
            <div className="space-y-6">
                <h3 className="text-center text-4xl font-bold text-brand-dark">Conservation & Economic Impact Report for {selectedYear}</h3>
                
                <Card title="Financial Summary" className="card-print">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-gray-500">Total Hunting-Related Income</p>
                            <p className="text-3xl font-bold text-green-600">${reportData?.huntingIncome.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Conservation Expense</p>
                            <p className="text-3xl font-bold text-red-600">${reportData?.conservationExpense.toLocaleString()}</p>
                        </div>
                         <div>
                            <p className="text-gray-500">Net Economic Impact</p>
                            <p className={`text-3xl font-bold ${((reportData?.huntingIncome || 0) - (reportData?.conservationExpense || 0)) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                ${((reportData?.huntingIncome || 0) - (reportData?.conservationExpense || 0)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card title="Sustainable Harvest Analysis" className="card-print">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Recommended Off-take</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actual Harvest</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData?.offtakeAnalysis.map(item => (
                                <tr key={item.species}>
                                    <td className="px-6 py-4 font-medium">{item.species}</td>
                                    <td className="px-6 py-4 text-center">{item.recommended}</td>
                                    <td className="px-6 py-4 text-center font-bold">{item.actual}</td>
                                    <td className="px-6 py-4 text-center">
                                        {item.actual <= item.recommended ? 
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Sustainable</span>
                                            : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Over Quota</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card title="Population Health Trends" className="card-print">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {reportData?.speciesForReport.map(species => (
                            <div key={species} className="h-80">
                                 <h4 className="text-lg font-semibold text-center text-brand-dark mb-2">{species} Population Trend</h4>
                                 <PopulationTrendChart surveys={populationSurveys} species={species} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
