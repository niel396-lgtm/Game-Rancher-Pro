
import { Animal, HabitatZone, InventoryItem, Transaction, TransactionType, Landmark, LandmarkType, Boundary, Task, Mortality, RainfallLog, VeldAssessment, Harvest } from './types';

export const INITIAL_ANIMALS: Animal[] = [
  { id: 'A001', species: 'White-tailed Deer', age: 4, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'WT-101' },
  { id: 'A002', species: 'Elk', age: 6, sex: 'Male', health: 'Good', conditionScore: 4, location: 'West Ridge', tagId: 'ELK-203' },
  { id: 'A003', species: 'Bison', age: 8, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'BSN-50' },
  { id: 'A004', species: 'Wild Turkey', age: 2, sex: 'Female', health: 'Good', conditionScore: 4, location: 'Oak Forest', tagId: 'TRK-31' },
  { id: 'A005', species: 'White-tailed Deer', age: 3, sex: 'Male', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'WT-102' },
  { id: 'A006', species: 'Elk', age: 5, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'West Ridge', tagId: 'ELK-204' },
  { id: 'A007', species: 'White-tailed Deer', age: 5, sex: 'Female', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'WT-103' },
];

export const INITIAL_HABITAT_ZONES: HabitatZone[] = [
  { id: 'H01', name: 'North Pasture', waterLevel: 'Normal', forageQuality: 'Abundant', veldCondition: 'Excellent', issues: [], carryingCapacity: 20 },
  { id: 'H02', name: 'West Ridge', waterLevel: 'High', forageQuality: 'Moderate', veldCondition: 'Good', issues: ['Fence damage on west border'], carryingCapacity: 15 },
  { id: 'H03', name: 'South Plains', waterLevel: 'Low', forageQuality: 'Abundant', veldCondition: 'Good', issues: ['Water pump requires maintenance'], carryingCapacity: 25 },
  { id: 'H04', name: 'Oak Forest', waterLevel: 'Normal', forageQuality: 'Moderate', veldCondition: 'Fair', issues: [], carryingCapacity: 10 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'I001', name: 'High-Protein Feed Pellets', category: 'Feed', quantity: 45, reorderLevel: 50, supplier: 'Feed Co.' },
  { id: 'I002', name: 'General Antibiotic', category: 'Medicine', quantity: 15, reorderLevel: 10, supplier: 'Vet Supply' },
  { id: 'I003', name: 'ATV Maintenance Kit', category: 'Equipment', quantity: 3, reorderLevel: 2, supplier: 'Ranch Parts' },
  { id: 'I004', name: 'Corn (50lb bags)', category: 'Feed', quantity: 80, reorderLevel: 100, supplier: 'Farm Supply' },
  { id: 'I005', name: 'Mineral Blocks', category: 'Feed', quantity: 25, reorderLevel: 20, supplier: 'Feed Co.' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 'T001', date: '2023-10-01', description: 'Hunting Lease - Group A', category: 'Leases', amount: 5000, type: TransactionType.Income },
    { id: 'T002', date: '2023-10-05', description: 'Vet Visit - Elk #203', category: 'Veterinary', amount: 350, type: TransactionType.Expense },
    { id: 'T003', date: '2023-10-10', description: 'Feed Order', category: 'Feed', amount: 1200, type: TransactionType.Expense },
    { id: 'T004', date: '2023-10-15', description: 'Equipment Repair', category: 'Maintenance', amount: 250, type: TransactionType.Expense },
    { id: 'T005', date: '2023-11-02', description: 'Hunting Lease - Group B', category: 'Leases', amount: 7500, type: TransactionType.Income },
    { id: 'T006', date: '2023-11-08', description: 'Fuel for Vehicles', category: 'Operations', amount: 400, type: TransactionType.Expense },
    { id: 'T007', date: '2023-11-12', description: 'Sale of 2 Deer', category: 'Sales', amount: 1800, type: TransactionType.Income },
    { id: 'T008', date: '2023-11-20', description: 'Fence Supplies', category: 'Maintenance', amount: 600, type: TransactionType.Expense },
    { id: 'T009', date: '2023-12-01', description: 'Winter Feed Stock Up', category: 'Feed', amount: 2500, type: TransactionType.Expense },
    { id: 'T010', date: '2023-12-15', description: 'Annual Insurance', category: 'Admin', amount: 3000, type: TransactionType.Expense },
    { id: 'T011', date: '2023-12-22', description: 'Guided Tour Income', category: 'Services', amount: 800, type: TransactionType.Income },
];

export const INITIAL_TASKS: Task[] = [
    { id: 'T01', text: 'Conduct prescribed burns (Late Spring)', completed: false },
    { id: 'T02', text: 'Check and repair fences (Early Spring)', completed: true },
    { id: 'T03', text: 'Plant food plots for deer (Late Summer)', completed: false },
    { id: 'T04', text: 'Monitor water sources (All Summer)', completed: false },
    { id: 'T05', text: 'Scout for invasive plant species (All Seasons)', completed: false },
    { id: 'T06', text: 'Prepare hunting stands and blinds (Late Summer)', completed: false },
];

export const INITIAL_MORTALITIES: Mortality[] = [];
export const INITIAL_HARVESTS: Harvest[] = [];

export const INITIAL_RAINFALL_LOGS: RainfallLog[] = [
    { id: 'R01', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], amount: 15 },
    { id: 'R02', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 5 },
];

export const INITIAL_VELD_ASSESSMENTS: VeldAssessment[] = [
    { id: 'VA01', habitatZoneId: 'H04', date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], condition: 'Good', notes: 'Post-rain recovery looks good.'},
    { id: 'VA02', habitatZoneId: 'H04', date: new Date().toISOString().split('T')[0], condition: 'Fair', notes: 'Showing signs of grazing pressure.'},
];


// Initial data for the mapping feature
export const INITIAL_LANDMARKS: Landmark[] = [
    { id: 'L01', name: 'Main Gate', type: LandmarkType.Gate, position: [30.508, -98.390] },
    { id: 'L02', name: 'North Trough', type: LandmarkType.WaterTrough, position: [30.518, -98.392] },
    { id: 'L03', name: 'Creek Dam', type: LandmarkType.Dam, position: [30.515, -98.385] },
    { id: 'L04', name: 'Lookout Hide', type: LandmarkType.HuntingHide, position: [30.511, -98.399] },
];

export const INITIAL_BOUNDARIES: Boundary[] = [
    {
        id: 'B01',
        name: 'Main Ranch Perimeter',
        positions: [
            [30.520, -98.400],
            [30.522, -98.380],
            [30.505, -98.382],
            [30.503, -98.402],
            [30.520, -98.400],
        ]
    }
];