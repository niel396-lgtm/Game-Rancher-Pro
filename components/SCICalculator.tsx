import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { SCI_FORMULAS } from '../constants';

interface SCICalculatorProps {
    isOpen: boolean;
    onClose: () => void;
    species: string;
    onApply: (score: string, measurements: Record<string, number>) => void;
    initialMeasurements: Record<string, number>;
}

export const SCICalculator: React.FC<SCICalculatorProps> = ({ isOpen, onClose, species, onApply, initialMeasurements }) => {
    const [measurements, setMeasurements] = useState<Record<string, number>>({});
    
    const speciesFormula = SCI_FORMULAS[species];

    useEffect(() => {
        if (isOpen) {
            setMeasurements(initialMeasurements || {});
        }
    }, [isOpen, initialMeasurements]);

    const totalScore = useMemo(() => {
        if (!speciesFormula) return 0;
        try {
            const score = speciesFormula.formula(measurements);
            return parseFloat(score.toFixed(4));
        } catch {
            return 0;
        }
    }, [measurements, speciesFormula]);
    
    const handleInputChange = (id: string, value: string) => {
        setMeasurements(prev => ({
            ...prev,
            [id]: parseFloat(value) || 0
        }));
    };
    
    const handleSubmit = () => {
        const scoreString = `SCI Score: ${totalScore}`;
        onApply(scoreString, measurements);
    };

    if (!speciesFormula) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`SCI Score Calculator for ${species}`}>
            <div className="space-y-4">
                {speciesFormula.fields.map(field => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.name} (in)</label>
                        <input
                            type="number"
                            step="0.125"
                            name={field.id}
                            id={field.id}
                            value={measurements[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                    </div>
                ))}

                <div className="pt-4 border-t text-center">
                    <p className="text-sm font-medium text-gray-500">Total Score</p>
                    <p className="text-3xl font-bold text-brand-dark">{totalScore}</p>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Apply Score</button>
            </div>
        </Modal>
    );
};
