
import React from 'react';
import { Card } from './ui/Card';
import { Transaction, PopulationSurvey, Animal } from '../types';

interface BioeconomicsReportProps {
    transactions: Transaction[];
    populationSurveys: PopulationSurvey[];
    animals: Animal[];
}

export const BioeconomicsReport: React.FC<BioeconomicsReportProps> = (props) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Bio-Economics Report</h2>
            <Card>
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-700">Feature Under Construction</h3>
                    <p className="text-gray-500 mt-2">This module for analyzing the economic impact of ecological decisions is coming soon.</p>
                </div>
            </Card>
        </div>
    );
};
