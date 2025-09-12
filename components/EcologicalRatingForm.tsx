import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { EcologicalRating } from '../types';

interface EcologicalRatingFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: Omit<EcologicalRating, 'id' | 'professionalId' | 'ranchId' | 'date'>) => void;
}

export const EcologicalRatingForm: React.FC<EcologicalRatingFormProps> = ({ isOpen, onClose, onSubmit }) => {
    const initialState = {
        habitatCondition: 3,
        animalHealth: 3,
        managementPractices: 3,
        justificationNotes: ''
    };
    const [formData, setFormData] = useState(initialState);

    const handleSliderChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, justificationNotes: e.target.value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData(initialState);
    };

    const Slider: React.FC<{label: string, name: keyof typeof initialState, value: number}> = ({label, name, value}) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label} ({value}/5)</label>
            <input
                type="range"
                min="1"
                max="5"
                name={name}
                value={value}
                onChange={(e) => handleSliderChange(name, e.target.value)}
                className="mt-1 block w-full"
            />
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Submit Ecological Rating">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Slider label="Habitat Condition" name="habitatCondition" value={formData.habitatCondition} />
                <Slider label="Animal Health & Welfare" name="animalHealth" value={formData.animalHealth} />
                <Slider label="Management Practices" name="managementPractices" value={formData.managementPractices} />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Justification & Notes</label>
                    <textarea
                        value={formData.justificationNotes}
                        onChange={handleNotesChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Provide brief notes justifying the scores, e.g., observations on erosion, animal body condition, genetic management, etc."
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Submit Rating</button>
                </div>
            </form>
        </Modal>
    );
};
