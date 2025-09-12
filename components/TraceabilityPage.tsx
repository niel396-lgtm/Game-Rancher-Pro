
import React from 'react';
import { Card } from './ui/Card';
import { CheckCircleIcon } from './ui/Icons';
import { GameMeatProcessing, RanchProfile } from '../types';

interface TraceabilityPageProps {
    batchInfo: GameMeatProcessing;
    ranchProfile: RanchProfile;
    onBack: () => void;
}

export const TraceabilityPage: React.FC<TraceabilityPageProps> = ({ batchInfo, ranchProfile, onBack }) => {
    return (
        <div className="bg-brand-light min-h-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <button onClick={onBack} className="mb-4 text-sm text-brand-primary hover:underline">&larr; Return to Management App</button>
                <Card className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-brand-dark">{ranchProfile.publicName}</h1>
                        <p className="text-lg text-gray-600">Game Meat Traceability Report</p>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Batch Number</p>
                            <p className="text-xl font-semibold text-brand-dark">{batchInfo.processingBatchNumber}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-500">Species</p>
                                <p className="text-xl font-semibold text-brand-dark">{batchInfo.species}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-500">Processing Date</p>
                                <p className="text-xl font-semibold text-brand-dark">{batchInfo.processingDate}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg flex items-center">
                            <CheckCircleIcon className="w-8 h-8 text-green-600 mr-4" />
                            <div>
                                <p className="text-lg font-semibold text-green-800">Health & Safety Verified</p>
                                <p className="text-sm text-green-700">This product has passed all necessary health and safety inspections as per local regulations.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-xs text-gray-400">
                        <p>Powered by Game Rancher Pro</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};