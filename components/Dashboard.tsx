
import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { AnimalChart } from './AnimalChart';
import { FinanceChart } from './FinanceChart';
import { SexRatioChart } from './SexRatioChart';
import { Animal, HabitatZone, InventoryItem, Transaction, TransactionType, Task, RainfallLog, Harvest, Permit } from '../types';
import { AnimalIcon, HabitatIcon, InventoryIcon, FinanceIcon, IssueIcon, PlusIcon, TrashIcon, RainfallIcon, TrophyIcon, PermitIcon } from './ui/Icons';
import { Modal } from './ui/Modal';
import { RANCH_AREA_HECTARES } from '../constants';

interface DashboardProps {
    animals: Animal[];
    habitats: HabitatZone[];
    inventory: InventoryItem[];
    transactions: Transaction[];
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
    harvests: Harvest[];
    rainfallLogs: RainfallLog[];
    addRainfallLog: (log: Omit<RainfallLog, 'id'>) => void;
    permits: Permit[];
}

const KpiCard: React.FC<{ icon: React.ReactNode; title: string; value: string; unit: string; }> = ({ icon, title, value, unit }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 bg-white rounded-full shadow mr-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-brand-dark">
                    {value} <span className="text-lg font-medium text-gray-600">{unit}</span>
                </p>
            </div>
        </div>
    </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ animals, habitats, inventory, transactions, tasks, addTask, toggleTask, removeTask, harvests, rainfallLogs, addRainfallLog, permits }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  
  const [newRainfallDate, setNewRainfallDate] = useState(new Date().toISOString().split('T')[0]);
  const [newRainfallAmount, setNewRainfallAmount] = useState('');

  const totalAnimals = animals.length;
  const lowStockItems = inventory.filter(item => item.quantity < item.reorderLevel).length;
  const habitatIssues = habitats.reduce((acc, zone) => acc + zone.issues.length, 0);

  const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
  
  const { expiringPermits, expiredPermits } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(today.getDate() + 60);

    return permits.reduce((acc, permit) => {
        const expiryDate = new Date(permit.expiryDate + 'T00:00:00');
        if (expiryDate < today) {
            acc.expiredPermits.push(permit);
        } else if (expiryDate <= sixtyDaysFromNow) {
            acc.expiringPermits.push(permit);
        }
        return acc;
    }, { expiringPermits: [] as Permit[], expiredPermits: [] as Permit[] });
  }, [permits]);
  
  // KPI Calculations
  const costPerAnimal = useMemo(() => {
    const animalExpenses = transactions
        .filter(t => t.type === TransactionType.Expense && t.linkedAnimalId)
        .reduce((sum, t) => sum + t.amount, 0);
    return animals.length > 0 ? animalExpenses / animals.length : 0;
  }, [transactions, animals]);

  const incomePerHectare = useMemo(() => {
    return RANCH_AREA_HECTARES > 0 ? totalIncome / RANCH_AREA_HECTARES : 0;
  }, [totalIncome]);

  const trophyQualityIndex = useMemo(() => {
    const kuduHarvests = harvests.filter(h => 
        h.species === 'Kudu' && (typeof h.hornLengthL === 'number' || typeof h.hornLengthR === 'number')
    );
    if (kuduHarvests.length === 0) return 0;

    const totalAverageHornLength = kuduHarvests.reduce((acc, harvest) => {
        const hasL = typeof harvest.hornLengthL === 'number';
        const hasR = typeof harvest.hornLengthR === 'number';
        if (hasL && hasR) return acc + (harvest.hornLengthL! + harvest.hornLengthR!) / 2;
        if (hasL) return acc + harvest.hornLengthL!;
        if (hasR) return acc + harvest.hornLengthR!;
        return acc;
    }, 0);
    return totalAverageHornLength / kuduHarvests.length;
  }, [harvests]);


  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskText);
    setNewTaskText('');
    setIsTaskModalOpen(false);
  };
  
  const handleAddRainfall = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newRainfallAmount);
    if (!newRainfallDate || isNaN(amount) || amount < 0) {
      alert("Please enter a valid date and amount.");
      return;
    }
    addRainfallLog({ date: newRainfallDate, amount });
    setNewRainfallAmount('');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Dashboard</h2>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <KpiCard
              icon={<FinanceIcon className="w-6 h-6 text-red-500" />}
              title="Avg. Cost / Animal"
              value={`$${costPerAnimal.toFixed(2)}`}
              unit=""
          />
          <KpiCard
              icon={<FinanceIcon className="w-6 h-6 text-green-500" />}
              title="Income / Hectare"
              value={`$${incomePerHectare.toFixed(2)}`}
              unit=""
          />
          <KpiCard
              icon={<TrophyIcon className="w-6 h-6 text-brand-accent" />}
              title="Kudu Trophy Index"
              value={trophyQualityIndex > 0 ? trophyQualityIndex.toFixed(2) : 'N/A'}
              unit={trophyQualityIndex > 0 ? 'inches' : ''}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-100 to-green-200">
            <div className="flex items-center">
                <div className="p-3 bg-white rounded-full shadow">
                    <AnimalIcon className="w-8 h-8 text-brand-primary"/>
                </div>
                <div className="ml-4">
                    <p className="text-gray-500">Total Animals</p>
                    <p className="text-3xl font-bold text-brand-dark">{totalAnimals}</p>
                </div>
            </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200">
            <div className="flex items-center">
                <div className="p-3 bg-white rounded-full shadow">
                    <InventoryIcon className="w-8 h-8 text-yellow-600"/>
                </div>
                <div className="ml-4">
                    <p className="text-gray-500">Low Stock Items</p>
                    <p className="text-3xl font-bold text-brand-dark">{lowStockItems}</p>
                </div>
            </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="flex items-center">
                <div className="p-3 bg-white rounded-full shadow">
                    <HabitatIcon className="w-8 h-8 text-blue-600"/>
                </div>
                <div className="ml-4">
                    <p className="text-gray-500">Habitat Issues</p>
                    <p className="text-3xl font-bold text-brand-dark">{habitatIssues}</p>
                </div>
            </div>
        </Card>
        <Card className="bg-gradient-to-br from-red-100 to-red-200">
            <div className="flex items-center">
                <div className="p-3 bg-white rounded-full shadow">
                    <FinanceIcon className="w-8 h-8 text-red-600"/>
                </div>
                <div className="ml-4">
                    <p className="text-gray-500">Net Balance</p>
                    <p className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(totalIncome - totalExpense).toLocaleString()}
                    </p>
                </div>
            </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <Card title="Financial Overview">
              <div className="h-80">
                  <FinanceChart data={transactions} />
              </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Animal Demographics">
                <div className="h-40">
                    <AnimalChart data={animals} />
                </div>
                <div className="h-40">
                    <SexRatioChart data={animals} />
                </div>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card title="Recent Alerts">
              <ul className="max-h-60 overflow-y-auto">
                  {inventory.filter(item => item.quantity < item.reorderLevel).map(item => (
                      <li key={item.id} className="flex items-center p-2 border-b">
                          <InventoryIcon className="w-5 h-5 text-yellow-500 mr-3" />
                          <span>Low stock for <strong>{item.name}</strong>. Current: {item.quantity}, Reorder at: {item.reorderLevel}.</span>
                      </li>
                  ))}
                   {habitats.flatMap(zone => zone.issues.map(issue => ({...zone, issue}))).map(item => (
                      <li key={`${item.id}-${item.issue}`} className="flex items-center p-2 border-b">
                          <IssueIcon className="w-5 h-5 text-red-500 mr-3" />
                          <span>Habitat issue in <strong>{item.name}</strong>: {item.issue}.</span>
                      </li>
                   ))}
                   {(!inventory.some(i => i.quantity < i.reorderLevel) && !habitats.some(h => h.issues.length > 0)) && <p className="p-2 text-gray-500">No active alerts.</p>}
              </ul>
          </Card>
          <Card title="Operational Tasks" titleClassName="flex justify-between items-center">
            <button onClick={() => setIsTaskModalOpen(true)} className="text-brand-primary hover:text-brand-dark -mt-4"><PlusIcon className="w-5 h-5" /></button>
            <ul className="max-h-60 overflow-y-auto">
              {tasks.map(task => (
                <li key={task.id} className="group flex items-center justify-between p-2 border-b hover:bg-gray-50">
                  <div className="flex items-center">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mr-3 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary" />
                    <span className={`${task.completed ? 'text-gray-400 line-through' : ''}`}>{task.text}</span>
                  </div>
                  <button onClick={() => removeTask(task.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Rainfall Log">
              <form onSubmit={handleAddRainfall} className="flex items-center gap-2 mb-3">
                  <input type="date" value={newRainfallDate} onChange={e => setNewRainfallDate(e.target.value)} className="flex-grow p-1 border rounded-md text-sm" required />
                  <input type="number" placeholder="mm" value={newRainfallAmount} onChange={e => setNewRainfallAmount(e.target.value)} className="w-20 p-1 border rounded-md text-sm" required />
                  <button type="submit" className="p-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark"><PlusIcon className="w-4 h-4"/></button>
              </form>
               <ul className="max-h-48 overflow-y-auto">
                {rainfallLogs.map(log => (
                  <li key={log.id} className="flex items-center justify-between p-2 border-b text-sm">
                    <div className="flex items-center">
                      <RainfallIcon className="w-4 h-4 mr-2 text-blue-500"/>
                      <span>{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="font-semibold">{log.amount} mm</span>
                  </li>
                ))}
              </ul>
          </Card>
      </div>

       <div className="mt-6">
          <Card title="Permit Expiry Watchlist">
            <ul className="max-h-60 overflow-y-auto">
              {expiredPermits.length === 0 && expiringPermits.length === 0 && (
                <p className="p-2 text-gray-500">No permits are expiring soon.</p>
              )}
              {expiredPermits.map(permit => (
                <li key={permit.id} className="flex items-center p-2 border-b">
                    <PermitIcon className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-700"><strong>EXPIRED:</strong> Permit <strong>{permit.permitNumber}</strong> ({permit.type}) expired on {permit.expiryDate}.</span>
                </li>
              ))}
              {expiringPermits.map(permit => (
                <li key={permit.id} className="flex items-center p-2 border-b">
                    <PermitIcon className="w-5 h-5 text-yellow-500 mr-3" />
                    <span>Permit <strong>{permit.permitNumber}</strong> ({permit.type}) expires on <strong>{permit.expiryDate}</strong>.</span>
                </li>
              ))}
            </ul>
          </Card>
      </div>

       <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add New Task">
          <form onSubmit={handleAddTask}>
              <textarea
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Describe the task..."
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  required
              />
              <div className="flex justify-end gap-4 mt-4">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Add Task</button>
              </div>
          </form>
      </Modal>

    </div>
  );
};