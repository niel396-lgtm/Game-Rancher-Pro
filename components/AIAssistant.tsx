
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { AIIcon } from './ui/Icons';
import { Message, Animal, HabitatZone, RainfallLog } from '../types';
import { getAIResponse } from '../services/geminiService';
import { RANCH_AREA_HECTARES } from '../constants';

interface AIAssistantProps {
    animals: Animal[];
    habitats: HabitatZone[];
    rainfallLogs: RainfallLog[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ animals, habitats, rainfallLogs }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! How can I help you manage your ranch today? Ask me about animal health, habitat improvement, or feed strategies.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const generateContextualPrompt = (userInput: string): string => {
    const stocking = animals.reduce((acc, animal) => {
        if (animal.forageType === 'Grazer') {
            acc.grazerLSU += animal.lsuEquivalent;
        } else if (animal.forageType === 'Browser') {
            acc.browserLSU += animal.lsuEquivalent;
        } else if (animal.forageType === 'Mixed-Feeder') {
            acc.grazerLSU += animal.lsuEquivalent * 0.5;
            acc.browserLSU += animal.lsuEquivalent * 0.5;
        }
        return acc;
    }, { grazerLSU: 0, browserLSU: 0 });

    const habitatSummary = habitats.map(h => `${h.name} (Veld Condition: ${h.veldCondition})`).join(', ');

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentRainfall = rainfallLogs
        .filter(log => new Date(log.date + 'T00:00:00') >= threeMonthsAgo)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const monthlyRainfall: Record<string, number> = recentRainfall.reduce((acc, log) => {
        const month = new Date(log.date + 'T00:00:00').toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + log.amount;
        return acc;
    }, {});
    
    const rainfallSummary = Object.entries(monthlyRainfall)
        .map(([month, total]) => `${month}: ${Math.round(total)}mm`)
        .join(', ');

    const activeIssues = habitats
        .flatMap(h => h.issues.map(issue => `${issue} (in ${h.name})`))
        .join('; ');

    const ranchContext = `
Current Ranch Context:
- Total Hectares: ${RANCH_AREA_HECTARES} ha
- Habitat Zones: ${habitatSummary || 'N/A'}
- Current Animal Stocking: ${stocking.grazerLSU.toFixed(1)} LSU Grazers, ${stocking.browserLSU.toFixed(1)} LSU Browsers.
- Recent Rainfall (last 3 months): ${rainfallSummary || 'No recent data'}
- Active Issues: ${activeIssues || 'None'}
`;

    return `${ranchContext}\nUser's Question: ${userInput}`;
  };


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    const fullPrompt = generateContextualPrompt(input);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getAIResponse(fullPrompt);
    
    const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold text-brand-dark mb-6">AI Assistant</h2>
      <Card className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto pr-4 mb-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <div className="p-2 bg-brand-primary rounded-full text-white"><AIIcon className="w-6 h-6" /></div>}
              <div className={`max-w-xl p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-secondary text-white rounded-br-none' : 'bg-gray-100 text-brand-dark rounded-bl-none'}`}>
                 <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-primary rounded-full text-white"><AIIcon className="w-6 h-6" /></div>
              <div className="max-w-xl p-4 rounded-2xl bg-gray-100 text-brand-dark rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-brand-secondary focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:bg-gray-400"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </Card>
    </div>
  );
};