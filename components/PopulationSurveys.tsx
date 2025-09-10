import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { PlusIcon } from './ui/Icons';
import { PopulationSurvey, HabitatZone, Animal } from '../types';

interface PopulationSurveysProps {
    surveys: PopulationSurvey[];
    addSurvey: (survey: Omit<PopulationSurvey, 'id'>) => void;
    habitats: HabitatZone[];
    animals: Animal[];
}

export const PopulationSurveys: React.FC<PopulationSurveysProps> = ({ surveys, addSurvey, habitats, animals }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const initialFormState = {
        date: new Date().toISOString().split('T')[0],
        habitatZoneId: '',
        species: '',
        method: 'Aerial Count (Sample)' as PopulationSurvey['method'],
        estimatedCount: 0,
        maleCount: 0,
        femaleCount: 0,
        juvenileCount: 0,
        confidence: 'Medium' as PopulationSurvey['confidence'],
        notes: ''
    };
    const [newSurvey, setNewSurvey] = useState(initialFormState);

    const speciesList = useMemo(() => Array.from(new Set(animals.map(a => a.species))).sort(), [animals]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewSurvey(prev => ({ 
            ...prev, 
            [name]: (name.includes('Count')) ? parseInt(value, 10) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSurvey.species || newSurvey.estimatedCount <= 0) {
            alert("Species and a valid Estimated Count are required.");
            return;
        }

        const surveyToAdd: Omit<PopulationSurvey, 'id'> = {
            ...newSurvey,
            habitatZoneId: newSurvey.habitatZoneId || undefined,
            maleCount: newSurvey.maleCount > 0 ? newSurvey.maleCount : undefined,
            femaleCount: newSurvey.femaleCount > 0 ? newSurvey.femaleCount : undefined,
            juvenileCount: newSurvey.juvenileCount > 0 ? newSurvey.juvenileCount : undefined,
            notes: newSurvey.notes || undefined,
        };

        addSurvey(surveyToAdd);
        setIsModalOpen(false);
        setNewSurvey(initialFormState);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Population Surveys</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Log New Survey
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {surveys.map(survey => {
                                const location = survey.habitatZoneId ? habitats.find(h => h.id === survey.habitatZoneId)?.name : 'Ranch-wide';
                                return (
                                    <tr key={survey.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{survey.species}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-dark">{survey.estimatedCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.method}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.confidence}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Population Survey">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" name="date" value={newSurvey.date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Species</label>
                            <select name="species" value={newSurvey.species} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required>
                                <option value="">Select Species...</option>
                                {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <select name="habitatZoneId" value={newSurvey.habitatZoneId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option value="">Ranch-wide</option>
                                {habitats.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Survey Method</label>
                            <select name="method" value={newSurvey.method} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option>Aerial Count (Sample)</option>
                                <option>Aerial Count (Total)</option>
                                <option>Ground Count</option>
                                <option>Camera Trap Estimate</option>
                                <option>Dung/Spore Count</option>
                            </select>
                        </div>
                    </div>
                    
                    <h4 className="text-md font-semibold text-gray-600 pt-4 border-t">Population Estimate</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Estimated Count</label>
                            <input type="number" name="estimatedCount" value={newSurvey.estimatedCount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Confidence Level</label>
                            <select name="confidence" value={newSurvey.confidence} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                                <option>High</option><option>Medium</option><option>Low</option>
                            </select>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">Optional demographic breakdown:</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Male Count</label>
                            <input type="number" name="maleCount" value={newSurvey.maleCount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Female Count</label>
                            <input type="number" name="femaleCount" value={newSurvey.femaleCount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Juvenile Count</label>
                            <input type="number" name="juvenileCount" value={newSurvey.juvenileCount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea name="notes" value={newSurvey.notes} onChange={handleInputChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300" />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Log Survey</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
