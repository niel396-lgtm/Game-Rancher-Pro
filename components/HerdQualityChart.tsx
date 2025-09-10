import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis, Line } from 'recharts';
import { Animal, AnimalMeasurement } from '../types';
import { SPECIES_BENCHMARKS } from '../constants';

interface HerdQualityChartProps {
  animals: Animal[];
  measurements: AnimalMeasurement[];
}

export const HerdQualityChart: React.FC<HerdQualityChartProps> = ({ animals, measurements }) => {
  const chartData = useMemo(() => {
    const kuduAnimals = animals.filter(a => a.species === 'Kudu' && a.sex === 'Male');
    
    const measurementMap = new Map<string, AnimalMeasurement[]>();
    measurements.forEach(m => {
        if(m.measurementType === 'Horn Length (L)' || m.measurementType === 'Horn Length (R)') {
            if (!measurementMap.has(m.animalId)) {
                measurementMap.set(m.animalId, []);
            }
            measurementMap.get(m.animalId)!.push(m);
        }
    });

    return kuduAnimals.map(animal => {
        const animalMeasurements = measurementMap.get(animal.id);
        if (!animalMeasurements || animalMeasurements.length === 0) {
            return null;
        }

        // Find the most recent measurement date
        const latestDate = animalMeasurements.reduce((latest, m) => 
            new Date(m.date) > new Date(latest) ? m.date : latest, 
        animalMeasurements[0].date);

        // Get all measurements from that date
        const latestMeasurements = animalMeasurements.filter(m => m.date === latestDate);

        // Average the left and right horn length
        const avgHornLength = latestMeasurements.reduce((sum, m) => sum + m.value, 0) / latestMeasurements.length;
        
        return {
            age: animal.age,
            hornLength: parseFloat(avgHornLength.toFixed(2)),
            tagId: animal.tagId
        };
    }).filter(Boolean);

  }, [animals, measurements]);
  
  if (chartData.length === 0) {
      return <div className="flex items-center justify-center h-full text-gray-500">No Kudu horn measurements logged.</div>
  }

  const kuduBenchmarks = SPECIES_BENCHMARKS.Kudu;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="age" name="Age" unit=" yrs" domain={['dataMin - 1', 'dataMax + 1']} />
        <YAxis type="number" dataKey="hornLength" name="Horn Length" unit=" in" />
        <ZAxis dataKey="tagId" name="Tag ID" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Line 
            type="monotone"
            data={kuduBenchmarks.AverageLine}
            dataKey="hornLength"
            name="Regional Average"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            activeDot={false}
        />
        <Line 
            type="monotone"
            data={kuduBenchmarks.TrophyLine}
            dataKey="hornLength"
            name="Trophy Benchmark"
            stroke="#ffc658"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
        />
        <Scatter name="Kudu Bulls" data={chartData} fill="#4A5C3D" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};