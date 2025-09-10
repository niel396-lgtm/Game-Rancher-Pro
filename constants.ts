import { Animal, HabitatZone, InventoryItem, Transaction, TransactionType, Landmark, LandmarkType, Boundary, Task, Mortality, RainfallLog, VeldAssessment, Harvest, Client, Permit, ReproductiveEvent, AnimalMeasurement } from './types';

export const RANCH_AREA_HECTARES = 5000;

const today = new Date();
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(today.getDate() + days);
  return date.toISOString().split('T')[0];
};
const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(today.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const INITIAL_PERMITS: Permit[] = [
  { id: 'P001', permitNumber: 'CITES-ZA-2023-115', type: 'CITES', issueDate: '2023-08-01', expiryDate: '2024-07-31', linkedSpecies: ['Sable Antelope'], notes: 'Export permit for 2 males.' },
  { id: 'P002', permitNumber: 'WC-TOPS-2024-045', type: 'TOPS', issueDate: '2024-01-15', expiryDate: getFutureDate(45), linkedSpecies: [], notes: 'General TOPS hunting permit for the season.' },
  { id: 'P003', permitNumber: 'PROV-NC-2022-821', type: 'Provincial', issueDate: '2022-09-01', expiryDate: getPastDate(10), linkedSpecies: ['Impala', 'Kudu'], notes: 'Capture and translocation permit.' },
  { id: 'P004', permitNumber: 'OTHER-VET-2024-01', type: 'Other', issueDate: '2024-03-01', expiryDate: getFutureDate(120), linkedSpecies: [], notes: 'Veterinary import of specific medicines.' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'C001', name: 'John Doe', email: 'john.d@example.com', phone: '555-1234', visitDates: ['2023-10-18 to 2023-10-22'] },
  { id: 'C002', name: 'Jane Smith', email: 'jane.s@example.com', phone: '555-5678', visitDates: ['2023-11-03 to 2023-11-07'] },
];

export const INITIAL_ANIMALS: Animal[] = [
  { id: 'A001', species: 'Impala', age: 3, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'IMP-01', forageType: 'Mixed-Feeder', lsuEquivalent: 0.25, lsuConsumptionRate: 912.5, category: 'Breeding Stock' },
  { id: 'A002', species: 'Kudu', age: 5, sex: 'Male', health: 'Good', conditionScore: 4, location: 'West Ridge', tagId: 'KDU-07', forageType: 'Browser', lsuEquivalent: 0.7, lsuConsumptionRate: 2555, category: 'Trophy' },
  { id: 'A003', species: 'Blue Wildebeest', age: 6, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'BWB-15', forageType: 'Grazer', lsuEquivalent: 0.8, lsuConsumptionRate: 2920, category: 'Production' },
  { id: 'A004', species: 'Warthog', age: 2, sex: 'Female', health: 'Good', conditionScore: 4, location: 'Oak Forest', tagId: 'WHG-21', forageType: 'Mixed-Feeder', lsuEquivalent: 0.2, lsuConsumptionRate: 730, category: 'Production' },
  { id: 'A005', species: 'Blesbok', age: 4, sex: 'Male', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'BLK-11', forageType: 'Grazer', lsuEquivalent: 0.4, lsuConsumptionRate: 1460, category: 'Production' },
  { id: 'A006', species: 'Kudu', age: 7, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'West Ridge', tagId: 'KDU-08', forageType: 'Browser', lsuEquivalent: 0.7, lsuConsumptionRate: 2555, category: 'Breeding Stock' },
  { id: 'A007', species: 'Impala', age: 4, sex: 'Female', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'IMP-02', forageType: 'Mixed-Feeder', lsuEquivalent: 0.25, lsuConsumptionRate: 912.5, damId: 'A001', sireId: 'A009', category: 'Breeding Stock' },
  { id: 'A008', species: 'Sable Antelope', age: 5, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'SBL-01', forageType: 'Grazer', lsuEquivalent: 0.7, lsuConsumptionRate: 2555, category: 'Breeding Stock' },
  { id: 'A009', species: 'Impala', age: 5, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'IMP-M1', forageType: 'Mixed-Feeder', lsuEquivalent: 0.3, lsuConsumptionRate: 1095, category: 'Breeding Stock' },
];

export const INITIAL_HABITAT_ZONES: HabitatZone[] = [
  { id: 'H01', name: 'North Pasture', waterLevel: 'Normal', forageQuality: 'Abundant', veldCondition: 'Excellent', issues: [], areaHectares: 850, forageProductionFactor: 3.0, grassToBrowseRatio: 0.9 },
  { id: 'H02', name: 'West Ridge', waterLevel: 'High', forageQuality: 'Moderate', veldCondition: 'Good', issues: ['Fence damage on west border'], areaHectares: 1200, forageProductionFactor: 2.2, grassToBrowseRatio: 0.4 },
  { id: 'H03', name: 'South Plains', waterLevel: 'Low', forageQuality: 'Abundant', veldCondition: 'Good', issues: ['Water pump requires maintenance'], areaHectares: 2000, forageProductionFactor: 2.8, grassToBrowseRatio: 0.8 },
  { id: 'H04', name: 'Oak Forest', waterLevel: 'Normal', forageQuality: 'Moderate', veldCondition: 'Fair', issues: [], areaHectares: 1000, forageProductionFactor: 2.0, grassToBrowseRatio: 0.2 },
];


export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'I001', name: 'High-Protein Feed Pellets', category: 'Feed', quantity: 45, reorderLevel: 50, supplier: 'Feed Co.' },
  { id: 'I002', name: 'General Antibiotic', category: 'Medicine', quantity: 15, reorderLevel: 10, supplier: 'Vet Supply' },
  { id: 'I003', name: 'ATV Maintenance Kit', category: 'Equipment', quantity: 3, reorderLevel: 2, supplier: 'Ranch Parts' },
  { id: 'I004', name: 'Corn (50lb bags)', category: 'Feed', quantity: 80, reorderLevel: 100, supplier: 'Farm Supply' },
  { id: 'I005', name: 'Mineral Blocks', category: 'Feed', quantity: 25, reorderLevel: 20, supplier: 'Feed Co.' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 'T001', date: '2023-10-01', description: 'Hunting Lease - Group A', category: 'Leases', amount: 5000, type: TransactionType.Income, clientId: 'C001' },
    { id: 'T002', date: getPastDate(200), description: 'Vet Visit - Kudu #KDU-07', category: 'Veterinary', amount: 350, type: TransactionType.Expense, linkedAnimalId: 'A002' },
    { id: 'T003', date: '2023-10-10', description: 'Feed Order', category: 'Feed', amount: 1200, type: TransactionType.Expense },
    { id: 'T004', date: '2023-10-15', description: 'Equipment Repair', category: 'Maintenance', amount: 250, type: TransactionType.Expense },
    { id: 'T005', date: '2023-11-02', description: 'Hunting Lease - Group B', category: 'Leases', amount: 7500, type: TransactionType.Income, clientId: 'C002' },
    { id: 'T006', date: '2023-11-08', description: 'Fuel for Vehicles', category: 'Operations', amount: 400, type: TransactionType.Expense },
    { id: 'T007', date: '2023-11-12', description: 'Sale of 2 Impala', category: 'Sales', amount: 1800, type: TransactionType.Income, permitId: 'P003' },
    { id: 'T008', date: '2023-11-20', description: 'Fence Supplies', category: 'Maintenance', amount: 600, type: TransactionType.Expense },
    { id: 'T009', date: getPastDate(15), description: 'High-value feed for breeding Sable', category: 'Feed', amount: 800, type: TransactionType.Expense, linkedAnimalId: 'A008' },
    { id: 'T010', date: getPastDate(300), description: 'Annual Insurance', category: 'Admin', amount: 3000, type: TransactionType.Expense },
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
export const INITIAL_HARVESTS: Harvest[] = [
    { id: 'H001', animalTagId: 'KDU-07', species: 'Kudu', date: '2023-10-20', hunter: 'John Doe', method: 'Rifle', trophyMeasurements: 'Rowland Ward', location: 'West Ridge', hornLengthL: 54.5, hornLengthR: 55.0, tipToTipSpread: 32.0, clientId: 'C001', photoUrl: 'https://images.unsplash.com/photo-1590393278637-13556d278a5a?q=80&w=2070&auto=format&fit=crop' },
    { id: 'H002', animalTagId: 'IMP-01', species: 'Impala', date: '2023-11-05', hunter: 'Jane Smith', method: 'Bow', trophyMeasurements: 'SCI Score: 60', location: 'North Pasture', hornLengthL: 22.0, hornLengthR: 21.5, tipToTipSpread: 18.0, clientId: 'C002', photoUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2072&auto=format&fit=crop' }
];

export const INITIAL_RAINFALL_LOGS: RainfallLog[] = [
    { id: 'R01', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], amount: 15 },
    { id: 'R02', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 5 },
];

export const INITIAL_VELD_ASSESSMENTS: VeldAssessment[] = [
    { id: 'VA01', habitatZoneId: 'H04', date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], speciesComposition: 8, basalCover: 7, soilErosion: 2, condition: 'Good', notes: 'Post-rain recovery looks good.'},
    { id: 'VA02', habitatZoneId: 'H04', date: new Date().toISOString().split('T')[0], speciesComposition: 6, basalCover: 5, soilErosion: 3, condition: 'Fair', notes: 'Showing signs of grazing pressure.'},
];

export const INITIAL_REPRODUCTIVE_EVENTS: ReproductiveEvent[] = [
    { id: 'RE001', offspringTagId: 'IMP-02', damTagId: 'IMP-01', sireTagId: 'IMP-M1', birthDate: getPastDate(1460), sex: 'Female', notes: 'Healthy birth, normal weight.' }
];

export const INITIAL_ANIMAL_MEASUREMENTS: AnimalMeasurement[] = [
    { id: 'AM001', animalId: 'A002', date: getPastDate(365), measurementType: 'Horn Length (L)', value: 48.5, unit: 'in', notes: 'Annual checkup, age 4.' },
    { id: 'AM002', animalId: 'A002', date: getPastDate(365), measurementType: 'Horn Length (R)', value: 49.0, unit: 'in', notes: 'Annual checkup, age 4.' },
    { id: 'AM003', animalId: 'A002', date: getPastDate(10), measurementType: 'Horn Length (L)', value: 52.0, unit: 'in', notes: 'Pre-season measurement, age 5.' },
    { id: 'AM004', animalId: 'A002', date: getPastDate(10), measurementType: 'Horn Length (R)', value: 52.5, unit: 'in', notes: 'Pre-season measurement, age 5.' },
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
        name: 'North Pasture',
        positions: [ [30.520, -98.402], [30.521, -98.391], [30.512, -98.392], [30.511, -98.403], [30.520, -98.402] ]
    },
    {
        id: 'B02',
        name: 'West Ridge',
        positions: [ [30.511, -98.403], [30.512, -98.392], [30.504, -98.393], [30.503, -98.404], [30.511, -98.403] ]
    },
    {
        id: 'B03',
        name: 'South Plains',
        positions: [ [30.512, -98.392], [30.513, -98.381], [30.505, -98.382], [30.504, -98.393], [30.512, -98.392] ]
    },
    {
        id: 'B04',
        name: 'Oak Forest',
        positions: [ [30.521, -98.391], [30.522, -98.380], [30.513, -98.381], [30.512, -98.392], [30.521, -98.391] ]
    }
];

export const SPECIES_BENCHMARKS = {
  "Kudu": {
    "TrophyLine": [ { age: 2, hornLength: 20 }, { age: 3, hornLength: 35 }, { age: 5, hornLength: 48 }, { age: 7, hornLength: 55 } ],
    "AverageLine": [ { age: 2, hornLength: 15 }, { age: 3, hornLength: 30 }, { age: 5, hornLength: 42 }, { age: 7, hornLength: 48 } ]
  }
};