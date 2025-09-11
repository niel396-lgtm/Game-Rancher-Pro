
import React from 'react';
import { Card } from './ui/Card';
import { OfficialDocument, Client, ProfessionalHunter, Hunt } from '../types';

interface DocumentHubProps {
  documents: OfficialDocument[];
  addDocument: (doc: Omit<OfficialDocument, 'id'>) => void;
  clients: Client[];
  professionalHunters: ProfessionalHunter[];
  hunts: Hunt[];
}

export const DocumentHub: React.FC<DocumentHubProps> = (props) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Document Hub</h2>
            <Card>
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-700">Feature Under Construction</h3>
                    <p className="text-gray-500 mt-2">This module for managing official documents and compliance paperwork is coming soon.</p>
                </div>
            </Card>
        </div>
    );
};
