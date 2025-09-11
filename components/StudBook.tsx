
import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Animal, ReproductiveEvent, AnimalMeasurement } from '../types';
import { SPECIES_BENCHMARKS } from '../constants';

interface StudBookProps {
  animals: Animal[];
  reproductiveEvents: ReproductiveEvent[];
  animalMeasurements: AnimalMeasurement[];
}

// Helper to get all ancestors with their shortest path generation number
const getAncestors = (animalId: string, animalMap: Map<string, Animal>): Map<string, number> => {
    const ancestors = new Map<string, number>();
    const queue: [string, number][] = [[animalId, 0]]; // [id, generation]
    const visited = new Set<string>();

    while (queue.length > 0) {
        const [currentId, generation] = queue.shift()!;
        
        if (visited.has(currentId) || generation > 8) continue; // Prevent infinite loops and limit depth
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
    if (!sire || !dam || sire.id === dam.id) return 0;
    
    const sireAncestors = getAncestors(sire.id, animalMap);
    const damAncestors = getAncestors(dam.id, animalMap);
    
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
    if (coeff >= 0.125) return 'bg-red-100 text-red-800'; // High risk (e.g., half-sibs or closer)
    if (coeff >= 0.0625) return 'bg-yellow-100 text-yellow-800'; // Moderate risk
    return 'bg-green-100 text-green-800';
};

const PedigreeColumn: React.FC<{ title: string; animal?: Animal; allAnimals: Map<string, Animal> }> = ({ title, animal, allAnimals }) => {
    const sire = animal?.sireId ? allAnimals.get(animal.sireId) : undefined;
    const dam = animal?.damId ? allAnimals.get(animal.damId) : undefined;
    return (
        <div className="flex-1 space-y-2">
            <h4 className="text-center font-semibold text-gray-600">{title}</h4>
            <div className={`p-2 rounded border text-center ${animal?.sex === 'Male' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}`}>
                <p className="font-bold">{animal?.tagId || 'Unknown'}</p>
                <p className="text-xs">{animal?.species}</p>
            </div>
            <div className="pl-4 border-l-2 ml-4 space-y-2">
                <div className="p-1 rounded border bg-blue-50 border-blue-200 text-sm">
                    <span className="font-semibold">Sire:</span> {sire?.tagId || 'Unknown'}
                </div>
                <div className="p-1 rounded border bg-pink-50 border-pink-200 text-sm">
                    <span className="font-semibold">Dam:</span> {dam?.tagId || 'Unknown'}
                </div>
            </div>
        </div>
    );
};

export const StudBook: React.FC<StudBookProps> = ({ animals, animalMeasurements }) => {
    const [selectedSireId, setSelectedSireId] = useState<string>('');
    const [selectedDamId, setSelectedDamId] = useState<string>('');
    
    const animalMap = useMemo(() => new Map(animals.map(a => [a.id, a])), [animals]);
    const sires = useMemo(() => animals.filter(a => a.sex === 'Male').sort((a,b) => a.tagId.localeCompare(b.tagId)), [animals]);
    const dams = useMemo(() => animals.filter(a => a.sex === 'Female').sort((a,b) => a.tagId.localeCompare(b.tagId)), [animals]);

    const { inbreedingCoefficient, projectedPotential, commonAncestors } = useMemo(() => {
        if (!selectedSireId || !selectedDamId) return { inbreedingCoefficient: 0, projectedPotential: null, commonAncestors: [] };
        
        const sire = animalMap.get(selectedSireId);
        const dam = animalMap.get(selectedDamId);
        if (!sire || !dam || sire.species !== dam.species) return { inbreedingCoefficient: 0, projectedPotential: null, commonAncestors: [] };

        const coefficient = calculateInbreedingCoefficient(sire, dam, animalMap);
        
        const sireAncestors = getAncestors(sire.id, animalMap);
        const damAncestors = getAncestors(dam.id, animalMap);
        const ancestors: string[] = [];
        sireAncestors.forEach((_, id) => {
            if(damAncestors.has(id)) ancestors.push(animalMap.get(id)?.tagId || id);
        });

        let potential: string | null = null;
        const speciesBenchmarks = (SPECIES_BENCHMARKS as any)[sire.species];
        if (speciesBenchmarks) {
            let sirePerformance = 1.0;
            let damPerformance = 1.0;

            const sireMeasurements = animalMeasurements.filter(m => m.animalId === sire.id && m.measurementType.includes('Horn'));
            if(sireMeasurements.length > 0) {
                 const avgMeasurement = sireMeasurements.reduce((acc, m) => acc + m.value, 0) / sireMeasurements.length;
                 const benchmark = speciesBenchmarks.AverageLine.find((p:any) => p.age === sire.age)?.hornLength || speciesBenchmarks.AverageLine[speciesBenchmarks.AverageLine.length-1].hornLength;
                 sirePerformance = avgMeasurement / benchmark;
            }

            const damSire = dam.sireId ? animalMap.get(dam.sireId) : null;
            if (damSire) {
                 const damSireMeasurements = animalMeasurements.filter(m => m.animalId === damSire.id && m.measurementType.includes('Horn'));
                 if(damSireMeasurements.length > 0) {
                     const avgMeasurement = damSireMeasurements.reduce((acc, m) => acc + m.value, 0) / damSireMeasurements.length;
                     const benchmark = speciesBenchmarks.AverageLine.find((p:any) => p.age === damSire.age)?.hornLength || speciesBenchmarks.AverageLine[speciesBenchmarks.AverageLine.length-1].hornLength;
                     damPerformance = avgMeasurement / benchmark;
                 }
            }
            
            const matureBenchmark = speciesBenchmarks.TrophyLine[speciesBenchmarks.TrophyLine.length - 1].hornLength;
            const projectedLength = matureBenchmark * ((sirePerformance + damPerformance) / 2);
            potential = `${projectedLength.toFixed(1)}" Mature Horn Length`;
        }

        return { inbreedingCoefficient: coefficient, projectedPotential: potential, commonAncestors: ancestors };

    }, [selectedSireId, selectedDamId, animalMap, animalMeasurements]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Stud Book & Potential Offspring Simulator</h2>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-b">
                     <div>
                        <label htmlFor="sire-select" className="block text-lg font-medium text-gray-700 mb-2">Select Sire</label>
                        <select id="sire-select" value={selectedSireId} onChange={e => setSelectedSireId(e.target.value)} className="mt-1 block w-full text-base border-gray-300 rounded-md shadow-sm">
                            <option value="">-- Select a male --</option>
                            {sires.map(s => <option key={s.id} value={s.id}>{s.tagId} ({s.species})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dam-select" className="block text-lg font-medium text-gray-700 mb-2">Select Dam</label>
                        <select id="dam-select" value={selectedDamId} onChange={e => setSelectedDamId(e.target.value)} className="mt-1 block w-full text-base border-gray-300 rounded-md shadow-sm" disabled={!selectedSireId}>
                            <option value="">-- Select a female --</option>
                            {dams.filter(d => d.species === animalMap.get(selectedSireId)?.species).map(d => <option key={d.id} value={d.id}>{d.tagId} ({d.species})</option>)}
                        </select>
                    </div>
                </div>

                {selectedSireId && selectedDamId && animalMap.get(selectedSireId)?.species === animalMap.get(selectedDamId)?.species ? (
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-brand-dark mb-4">Pairing Analysis</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className={`p-4 rounded-lg text-center ${getInbreedingColor(inbreedingCoefficient)}`}>
                                <p className="font-semibold">Wright's Inbreeding Coefficient</p>
                                <p className="text-3xl font-bold">{(inbreedingCoefficient * 100).toFixed(2)}%</p>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-100 text-blue-800 text-center">
                                <p className="font-semibold">Projected Genetic Potential</p>
                                <p className="text-3xl font-bold">{projectedPotential || 'N/A'}</p>
                            </div>
                        </div>
                         <div>
                             <h3 className="text-lg font-semibold text-brand-dark mb-2">Pedigree Comparison</h3>
                             <p className="text-sm text-gray-600 mb-2">Common Ancestors: <span className="font-semibold">{commonAncestors.join(', ') || 'None Detected'}</span></p>
                             <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                 <PedigreeColumn title="Sire's Lineage" animal={animalMap.get(selectedSireId)} allAnimals={animalMap} />
                                 <PedigreeColumn title="Dam's Lineage" animal={animalMap.get(selectedDamId)} allAnimals={animalMap} />
                             </div>
                         </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Please select a compatible sire and dam to simulate a potential pairing.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
