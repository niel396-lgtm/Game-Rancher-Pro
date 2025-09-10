
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AnimalManagement } from './components/AnimalManagement';
import { HabitatManagement } from './components/HabitatManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { FinancialTracker } from './components/FinancialTracker';
import { AIAssistant } from './components/AIAssistant';
import { RanchMap } from './components/RanchMap';
import { ClientManagement } from './components/ClientManagement';
import { View, Animal, HabitatZone, InventoryItem, Transaction, Landmark, Boundary, Task, Mortality, RainfallLog, VeldAssessment, Harvest, Client } from './types';
import { INITIAL_ANIMALS, INITIAL_HABITAT_ZONES, INITIAL_INVENTORY, INITIAL_TRANSACTIONS, INITIAL_LANDMARKS, INITIAL_BOUNDARIES, INITIAL_TASKS, INITIAL_MORTALITIES, INITIAL_RAINFALL_LOGS, INITIAL_VELD_ASSESSMENTS, INITIAL_HARVESTS, INITIAL_CLIENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);

  // Lifted state for global management
  const [animals, setAnimals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [habitats, setHabitats] = useState<HabitatZone[]>(INITIAL_HABITAT_ZONES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [landmarks, setLandmarks] = useState<Landmark[]>(INITIAL_LANDMARKS);
  const [boundaries, setBoundaries] = useState<Boundary[]>(INITIAL_BOUNDARIES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [mortalities, setMortalities] = useState<Mortality[]>(INITIAL_MORTALITIES);
  const [harvests, setHarvests] = useState<Harvest[]>(INITIAL_HARVESTS);
  const [rainfallLogs, setRainfallLogs] = useState<RainfallLog[]>(INITIAL_RAINFALL_LOGS);
  const [veldAssessments, setVeldAssessments] = useState<VeldAssessment[]>(INITIAL_VELD_ASSESSMENTS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);


  const addAnimal = (animal: Omit<Animal, 'id'>) => {
    const newAnimal = { ...animal, id: `A${Date.now()}` };
    setAnimals(prev => [...prev, newAnimal].sort((a,b) => a.tagId.localeCompare(b.tagId)));
  };

  const removeAnimal = (animalId: string) => {
    setAnimals(prev => prev.filter(animal => animal.id !== animalId));
  };
  
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: `C${Date.now()}` };
    setClients(prev => [...prev, newClient].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const addTask = (text: string) => {
      if (!text.trim()) return;
      const newTask: Task = { id: `T${Date.now()}`, text, completed: false };
      setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (taskId: string) => {
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const removeTask = (taskId: string) => {
      setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const logAnimalMortality = (animal: Animal, cause: string) => {
      const newMortality: Mortality = {
          id: `M${Date.now()}`,
          animalTagId: animal.tagId,
          species: animal.species,
          date: new Date().toISOString().split('T')[0],
          cause: cause || 'Unknown',
          location: animal.location
      };
      setMortalities(prev => [newMortality, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      removeAnimal(animal.id);
  };
  
  const logAnimalHarvest = (animal: Animal, harvestData: Omit<Harvest, 'id' | 'animalTagId' | 'species' | 'date' | 'location'>) => {
    const newHarvest: Harvest = {
        id: `H${Date.now()}`,
        animalTagId: animal.tagId,
        species: animal.species,
        date: new Date().toISOString().split('T')[0],
        location: animal.location,
        ...harvestData,
    };
    setHarvests(prev => [newHarvest, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    removeAnimal(animal.id);
  };

  const addRainfallLog = (logData: Omit<RainfallLog, 'id'>) => {
      const newLog: RainfallLog = { ...logData, id: `R${Date.now()}` };
      setRainfallLogs(prev => [newLog, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const addVeldAssessment = (assessmentData: Omit<VeldAssessment, 'id'>) => {
    const newAssessment: VeldAssessment = { ...assessmentData, id: `VA${Date.now()}` };
    setVeldAssessments(prev => [newAssessment, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  const addLandmark = (landmark: Omit<Landmark, 'id'>) => {
    const newLandmark = { ...landmark, id: `L${Date.now()}` };
    setLandmarks(prev => [...prev, newLandmark]);
  };

  const addBoundary = (boundary: Omit<Boundary, 'id'>) => {
    const newBoundary = { ...boundary, id: `B${Date.now()}` };
    setBoundaries(prev => [...prev, newBoundary]);
  };

  const removeMapFeature = (id: string) => {
    if (id.startsWith('L')) {
      setLandmarks(prev => prev.filter(l => l.id !== id));
    } else if (id.startsWith('B')) {
      setBoundaries(prev => prev.filter(b => b.id !== id));
    }
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...transactionData, id: `T${Date.now()}` };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard 
          animals={animals} 
          habitats={habitats} 
          inventory={inventory} 
          transactions={transactions} 
          tasks={tasks}
          addTask={addTask}
          toggleTask={toggleTask}
          removeTask={removeTask}
          harvests={harvests}
          rainfallLogs={rainfallLogs}
          addRainfallLog={addRainfallLog}
          />;
      case View.Animals:
        return <AnimalManagement 
          animals={animals} 
          habitats={habitats} 
          addAnimal={addAnimal} 
          removeAnimal={removeAnimal} 
          mortalities={mortalities}
          logAnimalMortality={logAnimalMortality}
          harvests={harvests}
          logAnimalHarvest={logAnimalHarvest}
          transactions={transactions}
          clients={clients}
          />;
      case View.Clients:
        return <ClientManagement clients={clients} addClient={addClient} />;
      case View.Habitat:
        return <HabitatManagement 
          habitats={habitats} 
          animals={animals}
          veldAssessments={veldAssessments}
          addVeldAssessment={addVeldAssessment} 
          />;
      case View.Inventory:
        return <InventoryManagement inventory={inventory} />;
      case View.Finance:
        return <FinancialTracker 
          transactions={transactions} 
          addTransaction={addTransaction}
          animals={animals}
          habitats={habitats}
          inventory={inventory}
          clients={clients}
          />;
      case View.AIAssistant:
        return <AIAssistant />;
      case View.RanchMap:
        return <RanchMap landmarks={landmarks} boundaries={boundaries} animals={animals} addLandmark={addLandmark} addBoundary={addBoundary} removeFeature={removeMapFeature} />;
      default:
        return <Dashboard 
          animals={animals} 
          habitats={habitats} 
          inventory={inventory} 
          transactions={transactions}
          tasks={tasks}
          addTask={addTask}
          toggleTask={toggleTask}
          removeTask={removeTask}
          harvests={harvests}
          rainfallLogs={rainfallLogs}
          addRainfallLog={addRainfallLog}
          />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-light text-brand-dark font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;