
import React from 'react';
import { Card } from './ui/Card';
// FIX: Alias the GameMeatProcessing type to avoid name collision with the component.
import { GameMeatProcessing as GameMeatProcessingType, Transaction } from '../types';

interface GameMeatProcessingProps {
  processingEntries: GameMeatProcessingType[];
  updateProcessingEntry: (entry: GameMeatProcessingType) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const GameMeatProcessing: React.FC<GameMeatProcessingProps> = (props) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Game Meat Processing</h2>
            <Card>
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-700">Feature Under Construction</h3>
                    <p className="text-gray-500 mt-2">This module for tracking game meat from harvest to sale is coming soon.</p>
                </div>
            </Card>
        </div>
    );
};
