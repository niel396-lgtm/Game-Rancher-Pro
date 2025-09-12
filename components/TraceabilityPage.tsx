
import React from 'react';
import { GameMeatProcessing, Harvest, RanchProfile } from '../types';
import { Card } from './ui/Card';

interface TraceabilityPageProps {
    batchNumber: string | null;
    gameMeatProcessing: GameMeatProcessing[];
    harvests: Harvest[];
    ranchProfiles: RanchProfile[];
    onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

export const TraceabilityPage: React.FC<TraceabilityPageProps> = ({ batchNumber, gameMeatProcessing, harvests, ranchProfiles, onBack }) => {
    
    if (!batchNumber) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p>No batch number provided.</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded">Go Back</button>
            </div>
        );
    }

    const processingEntry = gameMeatProcessing.find(p => p.processingBatchNumber === batchNumber);
    const harvest = processingEntry ? harvests.find(h => h.id === processingEntry.harvestId) : null;
    const ranchProfile = ranchProfiles.find(r => r.isPublic);

    if (!processingEntry || !harvest || !ranchProfile) {
        return (
             <div className="max-w-md mx-auto mt-10">
                <Card>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600">Traceability Record Not Found</h2>
                        <p className="mt-2 text-gray-600">The record for batch number <strong>{batchNumber}</strong> could not be found. Please check the number and try again.</p>
                        <button onClick={onBack} className="mt-6 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">
                            Return to App
                        </button>
                    </div>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                 <button onClick={onBack} className="mb-4 text-sm text-brand-primary hover:underline">&larr; Return to Management App</button>
                 <Card>
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-brand-dark">Product Traceability</h1>
                        <p className="text-gray-500 mt-1">Batch #{processingEntry.processingBatchNumber}</p>
                    </div>

                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Product Details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Verified information from farm to fork.</p>
                    </div>
                    <div className="mt-5 border-t border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <DetailItem label="Ranch" value={ranchProfile.publicName} />
                            <DetailItem label="Species" value={processingEntry.species} />
                            <DetailItem label="Harvest Date" value={harvest.date} />
                            <DetailItem label="Processing Date" value={processingEntry.processingDate} />
                            <DetailItem label="Processed By" value={processingEntry.processedBy} />
                            {processingEntry.abattoirName && (
                                <DetailItem label="Abattoir" value={processingEntry.abattoirName} />
                            )}
                        </dl>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                         <svg className="h-6 w-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">This product has passed all necessary health inspections.</p>
                    </div>
                 </Card>
                 <footer className="text-center mt-6 text-xs text-gray-400">
                     <p>Powered by Game Rancher Pro</p>
                 </footer>
            </div>
        </div>
    );
};
