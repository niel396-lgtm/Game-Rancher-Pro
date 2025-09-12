
import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Animal, ReproductiveEvent, AnimalMeasurement } from '../types';

interface StudBookProps {
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

export const StudBook: React.FC<StudBookProps> = ({ animals, reproductiveEvents, animalMeasurements }) => {
    const [selectedDamId, setSelectedDamId] = useState<string>('');
    const animalMap = useMemo(() => new Map(animals.map(a => [a.id, a])), [animals]);
    const tagIdToAnimalMap = useMemo(() => new Map(animals.map(a => [a.tagId, a])), [animals]);


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

    const intergenerationalIntervals = useMemo(() => {
        const intervals: { [species: string]: { ages: number[] } } = {};
        const today = new Date();

        reproductiveEvents.forEach(event => {
            const dam = tagIdToAnimalMap.get(event.damTagId);
            const sire = event.sireTagId ? tagIdToAnimalMap.get(event.sireTagId) : undefined;

            if (!dam) return;

            const species = dam.species;
            if (!intervals[species]) {
                intervals[species] = { ages: [] };
            }

            const localEventDate = new Date(event.birthDate + 'T00:00:00');

            const calculateAgeAtEvent = (parent: Animal) => {
                const birthDateEstimate = new Date(today);
                birthDateEstimate.setFullYear(today.getFullYear() - parent.age);
                const ageInMillis = localEventDate.getTime() - birthDateEstimate.getTime();
                return ageInMillis / (1000 * 3600 * 24 * 365.25);
            };

            const damAgeAtEvent = calculateAgeAtEvent(dam);
            if (damAgeAtEvent > 0) {
                 intervals[species].ages.push(damAgeAtEvent);
            }

            if (sire) {
                const sireAgeAtEvent = calculateAgeAtEvent(sire);
                if (sireAgeAtEvent > 0) {
                    intervals[species].ages.push(sireAgeAtEvent);
                }
            }
        });

        const results: { species: string, interval: number }[] = [];
        for (const species in intervals) {
            if (intervals[species].ages.length > 0) {
                const totalAge = intervals[species].ages.reduce((sum, age) => sum + age, 0);
                results.push({
                    species,
                    interval: totalAge / intervals[species].ages.length
                });
            }
        }

        return results.sort((a, b) => a.species.localeCompare(b.species));
    }, [animals, reproductiveEvents, tagIdToAnimalMap]);

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

             <Card className="mt-6">
                <h3 className="text-xl font-semibold text-brand-dark mb-4">
                    Mean Inter-generational Interval
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    The average age of parents when their offspring are born. A shorter interval can accelerate genetic progress but may increase inbreeding if not managed.
                </p>
                {intergenerationalIntervals.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {intergenerationalIntervals.map(item => (
                            <div key={item.species} className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="font-semibold text-brand-dark">{item.species}</p>
                                <p className="text-2xl font-bold text-brand-primary">{item.interval.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">years</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Not enough reproductive data to calculate intervals.</p>
                )}
            </Card>
        </div>
    );
};
