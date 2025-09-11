import React from 'react';
import { Client, Harvest } from '../types';
import { Card } from './ui/Card';

interface ClientProfileProps {
  client: Client;
  harvests: Harvest[];
  onBack: () => void;
}

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-lg font-semibold text-brand-dark">{value}</div>
    </div>
);

export const ClientProfile: React.FC<ClientProfileProps> = ({ client, harvests, onBack }) => {
    const clientHarvests = harvests.filter(h => h.clientId === client.id && h.photoUrl);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-brand-dark">{client.name}</h2>
            <p className="text-lg text-gray-600">Client Profile</p>
        </div>
        <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
            &larr; Back to List
        </button>
      </div>

      <Card title="Client Details" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetailItem label="Email Address" value={client.email || 'N/A'} />
              <DetailItem label="Phone Number" value={client.phone || 'N/A'} />
              <DetailItem label="Visit History" value={client.visitDates.join(', ') || 'No visits recorded'} />
          </div>
      </Card>
      
      <Card title="Trophy Gallery">
        {clientHarvests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientHarvests.map(harvest => (
                    <div key={harvest.id} className="rounded-lg overflow-hidden shadow-lg">
                        {/* FIX: Replaced non-existent `harvest.hunter` property with `client.name`. */}
                        <img src={harvest.photoUrl} alt={`${harvest.species} harvested by ${client.name}`} className="w-full h-56 object-cover"/>
                        <div className="p-4 bg-white">
                            <p className="font-bold text-lg">{harvest.species}</p>
                            <p className="text-sm text-gray-600">Date: {harvest.date}</p>
                            {/* FIX: Replaced non-existent `harvest.hunter` property with `client.name`. */}
                            <p className="text-sm text-gray-600">Hunter: {client.name}</p>
                            {harvest.trophyMeasurements && <p className="text-sm text-gray-600 mt-2"><em>{harvest.trophyMeasurements}</em></p>}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500">No trophy photos on record for this client.</p>
        )}
      </Card>
    </div>
  );
};