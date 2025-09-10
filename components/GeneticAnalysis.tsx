

import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Animal, ReproductiveEvent, AnimalMeasurement } from '../types';

interface GeneticAnalysisProps {
  animals: Animal[];
  reproductiveEvents: ReproductiveEvent[];
  animalMeasurements: AnimalMeasurement[];
}

interface SireRecommendation {
    sire: Animal;
    inbreedingCoefficient: number;
    latestMeasurement: number | null;
    offspringCount: number;
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
            // Only add ancestors, not the animal itself.
            if (!ancestors.has(currentId) || ancestors.get(currentId)! > generation) {
                ancestors.set(currentId, generation);
            }
        }
        
        const animal = animalMap.get(currentId);
        if (animal?.sireId) {
            queue.push([animal.sireId, generation + 1]);
        }
        if (animal?.damId) {
            queue.push([animal.damId, generation + 1]);
        }
    }
    return ancestors;
};

// Main calculation function for Wright's coefficient of inbreeding
const calculateInbreedingCoefficient = (sire: Animal, dam: Animal, animalMap: Map<string, Animal>): number => {
    if (!sire || !dam || sire.id === dam.id) return 1.0;
    
    const sireAncestors = getAncestors(sire.id, animalMap);
    const damAncestors = getAncestors(dam.id, animalMap);
    
    // An animal cannot be its own ancestor
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

const getInbreedingColor = (coeff: number) => {
    if (coeff > 0.125) return 'text-red-600 font-bold'; // High risk (e.g., half-sibs or closer)
    if (coeff > 0.0625) return 'text-yellow-600 font-semibold'; // Moderate risk
    return 'text-green-600';
};

export const GeneticAnalysis: React.FC<GeneticAnalysisProps> = ({ animals, reproductiveEvents, animalMeasurements }) => {
    const [selectedDamId, setSelectedDamId] = useState<string>('');
    const animalMap = useMemo(() => new Map(animals.map(a => [a.id, a])), [animals]);

    const dams = useMemo(() => animals.filter(a => a.sex === 'Female'), [animals]);

    const sireRecommendations = useMemo((): SireRecommendation[] => {
        if (!selectedDamId) return [];

        const selectedDam = animalMap.get(selectedDamId);
        if (!selectedDam) return [];

        const potentialSires = animals.filter(a => a.sex === 'Male' && a.species === selectedDam.species && a.id !== selectedDam.id);

        const recommendations = potentialSires.map(sire => {
            const inbreedingCoefficient = calculateInbreedingCoefficient(sire, selectedDam, animalMap);

            const sireMeasurements = animalMeasurements
                .filter(m => m.animalId === sire.id && (m.measurementType === 'Horn Length (L)' || m.measurementType === 'Horn Length (R)'))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            let latestMeasurement: number | null = null;
            if (sireMeasurements.length > 0) {
                 const latestDate = sireMeasurements[0].date;
                 const latestMeasurementsOnDate = sireMeasurements.filter(m => m.date === latestDate);
                 latestMeasurement = latestMeasurementsOnDate.reduce((sum, m) => sum + m.value, 0) / latestMeasurementsOnDate.length;
            }

            const offspringCount = reproductiveEvents.filter(e => e.sireTagId === sire.tagId).length;

            return { sire, inbreedingCoefficient, latestMeasurement, offspringCount };
        });

        // Sort by lowest inbreeding, then by best measurement
        return recommendations.sort((a, b) => {
            if (a.inbreedingCoefficient < b.inbreedingCoefficient) return -1;
            if (a.inbreedingCoefficient > b.inbreedingCoefficient) return 1;
            if (b.latestMeasurement && a.latestMeasurement) {
                return b.latestMeasurement - a.latestMeasurement;
            }
            return 0;
        });

    }, [selectedDamId, animals, reproductiveEvents, animalMeasurements, animalMap]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Genetic Analysis & Breeding Recommendations</h2>
            <Card>
                <div className="mb-6">
                    <label htmlFor="dam-select" className="block text-lg font-medium text-gray-700 mb-2">
                        Select a Dam to Analyze Potential Pairings
                    </label>
                    <select
                        id="dam-select"
                        value={selectedDamId}
                        onChange={(e) => setSelectedDamId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-md shadow"
                    >
                        <option value="">-- Select a female animal --</option>
                        {dams.map(dam => (
                            <option key={dam.id} value={dam.id}>
                                {dam.tagId} ({dam.species})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedDamId ? (
                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-semibold text-brand-dark mb-4">
                           Breeding Recommendations for Dam: {animalMap.get(selectedDamId)?.tagId}
                        </h3>
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sire Tag ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inbreeding Coefficient</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Horn Avg. (in)</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Known Offspring</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {sireRecommendations.map((rec, index) => (
                                    <tr key={rec.sire.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">{rec.sire.tagId}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getInbreedingColor(rec.inbreedingCoefficient)}`}>
                                            {(rec.inbreedingCoefficient * 100).toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rec.latestMeasurement ? rec.latestMeasurement.toFixed(2) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.offspringCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Please select a dam from the dropdown to see breeding recommendations.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};