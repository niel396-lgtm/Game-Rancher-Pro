
import React, { useMemo, useState } from 'react';
import { Card } from './ui/Card';
import { Animal, ReproductiveEvent, AnimalMeasurement } from '../types';
import { SPECIES_PARAMETERS, SPECIES_BENCHMARKS } from '../constants';

interface HarvestPlanningProps {
  animals: Animal[];
  reproductiveEvents: ReproductiveEvent[];
  animalMeasurements: AnimalMeasurement[];
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

export const HarvestPlanning: React.FC<HarvestPlanningProps> = ({ animals, reproductiveEvents, animalMeasurements }) => {
    const [speciesFilter, setSpeciesFilter] = useState('All');

    const harvestCandidates = useMemo((): HarvestCandidate[] => {
        const animalMap = new Map(animals.map(a => [a.id, a]));

        const candidates = animals.map(animal => {
            let score = 0;
            const reasons: { text: string; severity: 'High' | 'Medium' | 'Low' }[] = [];

            const speciesParams = (SPECIES_PARAMETERS as any)[animal.species];
            const speciesBenchmarks = (SPECIES_BENCHMARKS as any)[animal.species];

            // 1. Age Score
            if (speciesParams && animal.age > speciesParams.primeReproductiveAge[1]) {
                const ageFactor = (animal.age - speciesParams.primeReproductiveAge[1]) / (speciesParams.maxAge - speciesParams.primeReproductiveAge[1]);
                score += Math.min(ageFactor * 30, 30);
                reasons.push({ text: `Past Prime Age (${animal.age} yrs)`, severity: 'High' });
            }

            // 2. Genetic Performance Score
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

            // 3. Reproductive Performance Score
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
            
            // 4. Inbreeding Score
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
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-brand-dark">Harvest Planning</h2>
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
            <Card>
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
        </div>
    );
};