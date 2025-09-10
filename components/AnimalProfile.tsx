
import React from 'react';
import { Animal } from '../types';
import { Card } from './ui/Card';
import { StarIcon } from './ui/Icons';

interface AnimalProfileProps {
  animal: Animal;
  onBack: () => void;
}

const getHealthColor = (health: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
  switch (health) {
    case 'Excellent': return 'bg-green-100 text-green-800';
    case 'Good': return 'bg-blue-100 text-blue-800';
    case 'Fair': return 'bg-yellow-100 text-yellow-800';
    case 'Poor': return 'bg-red-100 text-red-800';
  }
};

const ConditionScore: React.FC<{ score: number }> = ({ score }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`w-5 h-5 ${i < score ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-lg font-semibold text-brand-dark">{value}</div>
    </div>
);


export const AnimalProfile: React.FC<AnimalProfileProps> = ({ animal, onBack }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-brand-dark">{animal.species}</h2>
            <p className="text-lg text-gray-600">Tag ID: {animal.tagId}</p>
        </div>
        <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
            &larr; Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Primary Details" className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <DetailItem label="Age" value={`${animal.age} years`} />
                <DetailItem label="Sex" value={animal.sex} />
                <DetailItem label="Current Location" value={animal.location} />
            </div>
        </Card>
        <Card title="Health & Condition">
            <div className="space-y-4">
                 <div>
                    <p className="text-sm text-gray-500">Health Status</p>
                    <span className={`px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full ${getHealthColor(animal.health)}`}>
                        {animal.health}
                      </span>
                </div>
                 <div>
                    <p className="text-sm text-gray-500">Condition Score</p>
                    <ConditionScore score={animal.conditionScore} />
                </div>
            </div>
        </Card>
      </div>

       <Card title="History (Placeholder)" className="mt-6">
            <p className="text-gray-500">Future enhancements will show a detailed history of health checks, location logs, and offspring records here.</p>
       </Card>

    </div>
  );
};
