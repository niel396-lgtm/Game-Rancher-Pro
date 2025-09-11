
import React from 'react';
import { Card } from './ui/Card';
// FIX: Alias the VeterinaryLog type to avoid name collision with the component.
import { VeterinaryLog as VeterinaryLogType, HealthProtocol, Animal } from '../types';

interface VeterinaryLogProps {
    veterinaryLogs: VeterinaryLogType[];
    addVeterinaryLog: (log: Omit<VeterinaryLogType, 'id'>) => void;
    healthProtocols: HealthProtocol[];
    addHealthProtocol: (protocol: Omit<HealthProtocol, 'id'>) => void;
    animals: Animal[];
}

export const VeterinaryLog: React.FC<VeterinaryLogProps> = (props) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Veterinary Log</h2>
            <Card>
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-700">Feature Under Construction</h3>
                    <p className="text-gray-500 mt-2">This module for logging veterinary procedures and health protocols is coming soon.</p>
                </div>
            </Card>
        </div>
    );
};
