
import React, { useMemo, useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Animal, ReproductiveEvent, AnimalMeasurement, PopulationSurvey, ManagementStyle } from '../types';
import { SPECIES_PARAMETERS, SPECIES_BENCHMARKS } from '../constants';

interface HarvestPlanningProps {
  animals: Animal[];
  reproductiveEvents: ReproductiveEvent[];
  animalMeasurements: AnimalMeasurement[];
  populationSurveys: PopulationSurvey[];
  managementStyle: ManagementStyle;
}

interface HarvestCandidate {
    animal: Animal;
    score: number;
    reasons: { text: string; severity: 'High' | 'Medium' | 'Low' }[];
}

// Helper to get all ancestors with their shortest path generation number
const getAncestors = (animalId: string, animalMap: Map<string, Animal>): Map<string, number> => {
    const ancestors = new Map<string, number>();
    const queue: [string, number][] = [[animalId, 0]]; // [id, generation]
    const visited = new Set<string>();

    while (queue.length > 0) {
        const [currentId, generation] = queue.shift()!;
        
        if (visited.has(currentId) || generation > 10) continue; // Prevent infinite loops and limit depth
        visited.add(currentId);

        if (generation > 0) {
            if (!ancestors.has(currentId) || ancestors.get(currentId)! > generation) {
                ancestors.set(currentId, generation);
            }
        }
        
        const animal = animalMap.get(currentId);
        if (animal?.sireId) queue.push([animal.sireId, generation + 1]);
        if (animal?.damId) queue.push([animal.damId, generation + 1]);
    }
    return ancestors;
};

// Main calculation function for Wright's coefficient of inbreeding
const calculateInbreedingCoefficient = (sire: Animal, dam: Animal, animalMap: Map<string, Animal>): number => {
    if (!sire || !dam || sire.id === dam.id) return 1.0;
    
    const sireAncestors = getAncestors(sire.id, animalMap);
    const damAncestors = getAncestors(dam.id, animalMap);
    
    if (sireAncestors.has(dam.id) || damAncestors.has(sire.id)) return 1.0;

    let totalCoefficient = 0;
    
    sireAncestors.forEach((n1, commonAncestorId) => {
        if (damAncestors.has(commonAncestorId)) {
            const n2 = damAncestors.get(commonAncestorId)!;
            totalCoefficient += Math.pow(0.5, n1 + n2 + 1);
        }
    });

    return totalCoefficient;
};

const ReasonBadge: React.FC<{ reason: { text: string; severity: 'High' | 'Medium' | 'Low' } }> = ({ reason }) => {
    const colorClasses = {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[reason.severity]}`}>
            {reason.text}
        </span>
    );
};

const IndividualCullingPlanner: React.FC<Pick<HarvestPlanningProps, 'animals' | 'reproductiveEvents' | 'animalMeasurements'>> = ({ animals, reproductiveEvents, animalMeasurements }) => {
    const [speciesFilter, setSpeciesFilter] = useState('All');

    const harvestCandidates = useMemo((): HarvestCandidate[] => {
        const animalMap = new Map(animals.map(a => [a.id, a]));

        const candidates = animals.map(animal => {
            let score = 0;
            const reasons: { text: string; severity: 'High' | 'Medium' | 'Low' }[] = [];

            const speciesParams = (SPECIES_PARAMETERS as any)[animal.species];
            const speciesBenchmarks = (SPECIES_BENCHMARKS as any)[animal.species];

            if (speciesParams && animal.age > speciesParams.primeReproductiveAge[1]) {
                const ageFactor = (animal.age - speciesParams.primeReproductiveAge[1]) / (speciesParams.maxAge - speciesParams.primeReproductiveAge[1]);
                score += Math.min(ageFactor * 30, 30);
                reasons.push({ text: `Past Prime Age (${animal.age} yrs)`, severity: 'High' });
            }

            if (speciesBenchmarks && animal.sex === 'Male') {
                const animalMeasurementsForType = animalMeasurements.filter(m => m.animalId === animal.id && (m.measurementType.includes('Horn')));
                if (animalMeasurementsForType.length > 0) {
                    const latestDate = animalMeasurementsForType.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
                    const latestMeasurements = animalMeasurementsForType.filter(m => m.date === latestDate);
                    const avgMeasurement = latestMeasurements.reduce((acc, m) => acc + m.value, 0) / latestMeasurements.length;
                    
                    const benchmarkPoints = speciesBenchmarks.AverageLine;
                    const lower = [...benchmarkPoints].filter(p => p.age <= animal.age).pop();
                    const upper = benchmarkPoints.find(p => p.age > animal.age);
                    let benchmarkValue = 0;

                    if (lower && upper) {
                        const ageRange = upper.age - lower.age;
                        const valRange = upper.hornLength - lower.hornLength;
                        benchmarkValue = lower.hornLength + ((animal.age - lower.age) / ageRange) * valRange;
                    } else if (lower) {
                        benchmarkValue = lower.hornLength;
                    }

                    if (benchmarkValue > 0 && avgMeasurement < benchmarkValue) {
                        const deficit = (benchmarkValue - avgMeasurement) / benchmarkValue;
                        score += deficit * 40;
                        reasons.push({ text: `Below Avg. Growth (-${(deficit * 100).toFixed(0)}%)`, severity: 'Medium' });
                    }
                }
            }

            if (animal.sex === 'Female' && speciesParams) {
                const births = reproductiveEvents.filter(e => e.damTagId === animal.tagId).sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
                if (births.length > 1) {
                    let totalInterval = 0;
                    for (let i = 1; i < births.length; i++) {
                        const d1 = new Date(births[i-1].birthDate);
                        const d2 = new Date(births[i].birthDate);
                        totalInterval += (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
                    }
                    const avgInterval = totalInterval / (births.length - 1);
                    if (avgInterval > speciesParams.idealCalvingInterval) {
                        const delayFactor = (avgInterval / speciesParams.idealCalvingInterval) - 1;
                        score += delayFactor * 25;
                        reasons.push({ text: `Low Repro. Rate (${Math.round(avgInterval)} day interval)`, severity: 'Medium' });
                    }
                }
            }
            
            if (animal.sireId && animal.damId) {
                const sire = animalMap.get(animal.sireId);
                const dam = animalMap.get(animal.damId);
                if (sire && dam) {
                    const inbreedingCoeff = calculateInbreedingCoefficient(sire, dam, animalMap);
                    if (inbreedingCoeff > 0.05) {
                        score += inbreedingCoeff * 100;
                        reasons.push({ text: `High Inbreeding (${(inbreedingCoeff * 100).toFixed(1)}%)`, severity: 'High' });
                    }
                }
            }
            
            return { animal, score: Math.round(score), reasons };
        });
        
        return candidates.filter(c => c.score > 0).sort((a, b) => b.score - a.score);

    }, [animals, reproductiveEvents, animalMeasurements]);

    const filteredCandidates = useMemo(() => {
        if (speciesFilter === 'All') return harvestCandidates;
        return harvestCandidates.filter(c => c.animal.species === speciesFilter);
    }, [harvestCandidates, speciesFilter]);
    
    const allSpecies = useMemo(() => ['All', ...Array.from(new Set(animals.map(a => a.species)))], [animals]);

    return (
        <Card>
            <div className="flex justify-end p-4">
                 <div>
                    <label htmlFor="species-filter" className="text-sm font-medium text-gray-700 mr-2">Filter by Species:</label>
                     <select 
                        id="species-filter" 
                        value={speciesFilter} 
                        onChange={e => setSpeciesFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm sm:text-sm"
                    >
                         {allSpecies.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                 </div>
            </div>
            <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Score</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributing Factors</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCandidates.length > 0 ? filteredCandidates.map((c, index) => (
                                <tr key={c.animal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">{c.animal.tagId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.animal.species}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.animal.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.animal.sex}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-dark">{c.score}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-wrap gap-1">
                                            {c.reasons.map(r => <ReasonBadge key={r.text} reason={r} />)}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-gray-500">
                                        No animals meet the criteria for harvesting recommendations.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </Card>
    );
}

const StrategicQuotaCalculator: React.FC<Pick<HarvestPlanningProps, 'populationSurveys'>> = ({ populationSurveys }) => {
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [targetPopulation, setTargetPopulation] = useState(0);
    const [growthRate, setGrowthRate] = useState(0);
    const [targetRatioMale, setTargetRatioMale] = useState(1);
    const [targetRatioFemale, setTargetRatioFemale] = useState(3);

    const surveySpecies = useMemo(() => Array.from(new Set(populationSurveys.map(s => s.species))).sort(), [populationSurveys]);
    
    const latestSurvey = useMemo(() => {
        if (!selectedSpecies) return null;
        return populationSurveys
            .filter(s => s.species === selectedSpecies)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }, [selectedSpecies, populationSurveys]);

    useEffect(() => {
        if (latestSurvey) {
            setTargetPopulation(latestSurvey.estimatedCount);
            const speciesParams = (SPECIES_PARAMETERS as any)[latestSurvey.species];
            if (speciesParams) {
                setGrowthRate(speciesParams.growthRateLambda);
            } else {
                setGrowthRate(1.1); // Default
            }
        } else {
            setTargetPopulation(0);
            setGrowthRate(0);
        }
    }, [latestSurvey]);

    const calculatedQuota = useMemo(() => {
        if (!latestSurvey || growthRate <= 0 || targetPopulation < 0) return { total: 0, males: 0, females: 0 };
        
        const N_t = latestSurvey.estimatedCount;
        const lambda = growthRate;
        const K = targetPopulation;

        const H = Math.round(N_t * lambda - K);
        if (H <= 0) return { total: 0, males: 0, females: 0 };

        const N_m = latestSurvey.maleCount || 0;
        const N_f = latestSurvey.femaleCount || 0;

        if (N_m === 0 || N_f === 0 || targetRatioMale <= 0 || targetRatioFemale <= 0) {
            return { total: H, males: 'N/A', females: 'N/A' };
        }

        const R = targetRatioFemale / targetRatioMale;
        
        let H_m = (R * N_m - N_f + H) / (1 + R);
        H_m = Math.round(Math.max(0, Math.min(N_m, H_m)));
        
        let H_f = H - H_m;
        if (H_f < 0) {
            H_f = 0;
            H_m = H;
        }
        if (H_f > N_f) {
            H_f = N_f;
            H_m = H - N_f;
        }
        H_m = Math.max(0, Math.min(N_m, H_m));

        return { total: H, males: H_m, females: H_f };

    }, [latestSurvey, targetPopulation, growthRate, targetRatioMale, targetRatioFemale]);


    return (
        <Card>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-brand-dark">Calculator Inputs</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Species</label>
                        <select value={selectedSpecies} onChange={e => setSelectedSpecies(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                            <option value="">Select a species...</option>
                            {surveySpecies.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estimated Current Population (Nₜ)</label>
                        <input type="number" value={latestSurvey?.estimatedCount || 0} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm" readOnly/>
                        <p className="text-xs text-gray-500 mt-1">From latest survey on {latestSurvey?.date || 'N/A'}</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Target Population / Carrying Capacity (K)</label>
                        <input type="number" value={targetPopulation} onChange={e => setTargetPopulation(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Annual Growth Rate (λ)</label>
                        <input type="number" step="0.01" value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                    </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-brand-dark">Recommended Quota</h3>
                    <div className="text-center py-6 border-y">
                        <p className="text-lg text-gray-600">Total Harvestable Surplus</p>
                        <p className="text-6xl font-bold text-brand-primary">{calculatedQuota.total}</p>
                        <p className="text-lg text-gray-600">animals</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Harvest Breakdown</h4>
                        <p className="text-sm text-gray-500 mb-2">Set a target post-harvest sex ratio to get a recommended breakdown.</p>
                        <div className="flex items-center gap-2">
                             <input type="number" value={targetRatioMale} onChange={e => setTargetRatioMale(Math.max(1, Number(e.target.value)))} className="w-16 p-1 text-center border-gray-300 rounded"/>
                             <span className="font-semibold">Bulls to</span>
                             <input type="number" value={targetRatioFemale} onChange={e => setTargetRatioFemale(Math.max(1, Number(e.target.value)))} className="w-16 p-1 text-center border-gray-300 rounded"/>
                             <span className="font-semibold">Cows</span>
                        </div>
                        <div className="mt-4 space-y-2 text-center">
                            <div className="p-3 bg-blue-100 rounded-md">
                                <p className="text-sm text-blue-800">Harvest Males</p>
                                <p className="text-2xl font-bold text-blue-900">{calculatedQuota.males}</p>
                            </div>
                            <div className="p-3 bg-pink-100 rounded-md">
                                <p className="text-sm text-pink-800">Harvest Females</p>
                                <p className="text-2xl font-bold text-pink-900">{calculatedQuota.females}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}


export const HarvestPlanning: React.FC<HarvestPlanningProps> = (props) => {
    const { animals, reproductiveEvents, animalMeasurements, populationSurveys, managementStyle } = props;
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-brand-dark">
                    {managementStyle === 'Intensive' 
                        ? 'Harvest Planning: Individual Culling' 
                        : 'Harvest Planning: Strategic Quota'
                    }
                 </h2>
            </div>

            {managementStyle === 'Intensive' ? (
                <IndividualCullingPlanner 
                    animals={animals} 
                    reproductiveEvents={reproductiveEvents} 
                    animalMeasurements={animalMeasurements} 
                />
            ) : (
                <StrategicQuotaCalculator 
                    populationSurveys={populationSurveys} 
                />
            )}
        </div>
    );
};