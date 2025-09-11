import React from 'react';
import { Harvest, Client, ProfessionalHunter } from '../types';
import { Card } from './ui/Card';

interface TrophySubmissionSheetProps {
    harvest: Harvest;
    client?: Client;
    professionalHunter?: ProfessionalHunter;
    onBack: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-2 px-3 grid grid-cols-3 gap-4 even:bg-gray-50">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900 col-span-2 font-semibold">{value || 'N/A'}</dd>
    </div>
);

export const TrophySubmissionSheet: React.FC<TrophySubmissionSheetProps> = ({ harvest, client, professionalHunter, onBack }) => {
    return (
        <div className="print-container">
            <div className="no-print flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Trophy Submission Sheet</h2>
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">&larr; Back to Log</button>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark">Print Sheet</button>
                </div>
            </div>

            <Card className="card-print">
                <div className="text-center mb-8">
                    <img src="https://safariclub.org/wp-content/uploads/2023/07/sci-logo-blue-300x200.png" alt="SCI Logo" className="mx-auto h-16" />
                    <h3 className="text-2xl font-bold text-brand-dark mt-2">Official Scoring System Score Sheet</h3>
                    <p className="text-gray-500">A simplified, digitally-generated worksheet for record-keeping.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold text-brand-dark mb-2 border-b pb-1">Harvest Details</h4>
                        <dl>
                            <DetailRow label="Species" value={harvest.species} />
                            <DetailRow label="Sex" value={harvest.sex} />
                            <DetailRow label="Date of Harvest" value={harvest.date} />
                            <DetailRow label="Locality" value={harvest.locality} />
                            <DetailRow label="Method of Take" value={harvest.method} />
                            <DetailRow label="Ranch/Farm" value={harvest.farmName} />
                        </dl>
                        
                        <h4 className="text-lg font-semibold text-brand-dark mb-2 border-b pb-1 mt-6">Personnel</h4>
                         <dl>
                            <DetailRow label="Hunter" value={client?.name} />
                            <DetailRow label="Professional Hunter" value={professionalHunter?.name} />
                            <DetailRow label="PH License #" value={professionalHunter?.licenseNumber} />
                        </dl>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-brand-dark mb-2 border-b pb-1">Measurement Details</h4>
                        <dl>
                            <DetailRow label="Length of Left Horn" value={harvest.hornLengthL ? `${harvest.hornLengthL}"` : 'N/A'} />
                            <DetailRow label="Length of Right Horn" value={harvest.hornLengthR ? `${harvest.hornLengthR}"` : 'N/A'} />
                            <DetailRow label="Circumference of Left Base" value={harvest.baseCircumferenceL ? `${harvest.baseCircumferenceL}"` : 'N/A'} />
                            <DetailRow label="Circumference of Right Base" value={harvest.baseCircumferenceR ? `${harvest.baseCircumferenceR}"` : 'N/A'} />
                            <DetailRow label="Tip-to-Tip Spread" value={harvest.tipToTipSpread ? `${harvest.tipToTipSpread}"` : 'N/A'} />
                        </dl>

                         <div className="mt-4 bg-brand-light p-4 rounded-lg text-center">
                            <p className="text-md font-medium text-brand-dark">Final Score / Trophy Info</p>
                            <p className="text-3xl font-bold text-brand-primary">{harvest.trophyMeasurements || 'Not Calculated'}</p>
                        </div>

                        <h4 className="text-lg font-semibold text-brand-dark mb-2 border-b pb-1 mt-6">Official Measurement</h4>
                         <dl>
                            <DetailRow label="Measured By (ID)" value={harvest.sciMeasurerId} />
                            <DetailRow label="Date Measured" value={harvest.dateMeasured} />
                        </dl>
                    </div>
                </div>

                {harvest.photoUrl && (
                    <div className="mt-8">
                         <h4 className="text-lg font-semibold text-brand-dark mb-2 border-b pb-1">Field Photo</h4>
                         <img src={harvest.photoUrl} alt={`Field photo of ${harvest.species}`} className="max-w-md mx-auto rounded-lg shadow-md" />
                    </div>
                )}
                
                <div className="mt-12 pt-8 border-t">
                     <p className="text-sm text-center text-gray-500 mb-6">I certify that, to the best of my knowledge, I took this animal without violating the wildlife laws or regulations of any state, province, or country.</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                         <div>
                             <div className="border-b-2 border-gray-400 border-dotted h-12"></div>
                             <p className="text-sm font-semibold mt-2">Hunter's Signature</p>
                         </div>
                         <div>
                             <div className="border-b-2 border-gray-400 border-dotted h-12"></div>
                             <p className="text-sm font-semibold mt-2">Professional Hunter's Signature</p>
                         </div>
                         <div>
                             <div className="border-b-2 border-gray-400 border-dotted h-12"></div>
                             <p className="text-sm font-semibold mt-2">Measurer's Signature</p>
                         </div>
                     </div>
                </div>
            </Card>
        </div>
    );
};
