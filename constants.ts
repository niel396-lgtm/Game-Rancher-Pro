import { Animal, HabitatZone, InventoryItem, Transaction, TransactionType, Landmark, LandmarkType, Boundary, Task, Mortality, RainfallLog, VeldAssessment, Harvest, Client, Permit, ReproductiveEvent, AnimalMeasurement, PopulationSurvey, ProfessionalHunter, Hunt, VeterinaryLog, HealthProtocol } from './types';

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

export const INITIAL_PROFESSIONAL_HUNTERS: ProfessionalHunter[] = [
    { id: 'PH001', name: 'John Smith', licenseNumber: 'LP-12345', licenseExpiryDate: getFutureDate(300), provincialEndorsements: ['Limpopo', 'Mpumalanga'] },
    { id: 'PH002', name: 'Peter Jones', licenseNumber: 'FS-67890', licenseExpiryDate: getFutureDate(45), provincialEndorsements: ['Free State', 'KwaZulu-Natal'] },
    { id: 'PH003', name: 'David Miller', licenseNumber: 'EC-54321', licenseExpiryDate: getPastDate(10), provincialEndorsements: ['Eastern Cape'] },
];

export const INITIAL_HUNTS: Hunt[] = [
    {
        id: 'HUNT001',
        clientId: 'C001',
        professionalHunterId: 'PH001',
        permitIds: ['P002'],
        startDate: '2023-10-18',
        endDate: '2023-10-22',
        status: 'Completed',
        checklist: {
            indemnitySigned: true,
            firearmPermitVerified: true,
            provincialLicenseAcquired: true,
        },
        notes: 'Successful Kudu hunt.'
    },
    {
        id: 'HUNT002',
        clientId: 'C002',
        professionalHunterId: 'PH002',
        permitIds: ['P002'],
        startDate: getPastDate(5),
        endDate: getFutureDate(2),
        status: 'Active',
        checklist: {
            indemnitySigned: true,
            firearmPermitVerified: false,
            provincialLicenseAcquired: true,
        },
        notes: 'Currently hunting Impala.'
    }
];


export const INITIAL_ANIMALS: Animal[] = [
  { id: 'A001', species: 'Impala', age: 9, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'IMP-01', forageType: 'Mixed-Feeder', lsuEquivalent: 0.25, lsuConsumptionRate: 912.5, category: 'Breeding Stock' },
  { id: 'A002', species: 'Kudu', age: 5, sex: 'Male', health: 'Good', conditionScore: 4, location: 'West Ridge', tagId: 'KDU-07', forageType: 'Browser', lsuEquivalent: 0.7, lsuConsumptionRate: 2555, category: 'Trophy' },
  { id: 'A003', species: 'Blue Wildebeest', age: 6, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'BWB-15', forageType: 'Grazer', lsuEquivalent: 0.8, lsuConsumptionRate: 2920, category: 'Production' },
  { id: 'A004', species: 'Warthog', age: 2, sex: 'Female', health: 'Good', conditionScore: 4, location: 'Oak Forest', tagId: 'WHG-21', forageType: 'Mixed-Feeder', lsuEquivalent: 0.2, lsuConsumptionRate: 730, category: 'Production' },
  { id: 'A005', species: 'Blesbok', age: 4, sex: 'Male', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'BLK-11', forageType: 'Grazer', lsuEquivalent: 0.4, lsuConsumptionRate: 1460, category: 'Production' },
  { id: 'A006', species: 'Kudu', age: 10, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'West Ridge', tagId: 'KDU-08', forageType: 'Browser', lsuEquivalent: 0.7, lsuConsumptionRate: 2555, category: 'Breeding Stock' },
  { id: 'A007', species: 'Impala', age: 4, sex: 'Female', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'IMP-02', forageType: 'Mixed-Feeder', lsuEquivalent: 0.25, lsuConsumptionRate: 912.5, damId: 'A001', sireId: 'A009', category: 'Breeding Stock' },
  { id: 'A008', species: 'Sable Antelope', age: 5, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'SBL-01', forageType: 'Grazer', lsuEquivalent: 0.7, lsuConsumptionRate: 2555, category: 'Breeding Stock' },
  { id: 'A009', species: 'Impala', age: 5, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'IMP-M1', forageType: 'Mixed-Feeder', lsuEquivalent: 0.3, lsuConsumptionRate: 1095, category: 'Breeding Stock', sireId: 'A009' /* Example of inbreeding */ },
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
    { id: 'T009', date: getPastDate(15), description: 'High-value feed for breeding Sable', category: 'Feed', amount: 800, type: TransactionType.Expense, linkedSpecies: 'Sable Antelope' },
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
    { id: 'H001', animalTagId: 'KDU-07', species: 'Kudu', sex: 'Male', date: '2023-10-20', professionalHunterId: 'PH001', method: 'Rifle', trophyMeasurements: 'Rowland Ward', location: 'West Ridge', hornLengthL: 54.5, hornLengthR: 55.0, tipToTipSpread: 32.0, clientId: 'C001', photoUrl: 'https://images.unsplash.com/photo-1590393278637-13556d278a5a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3', farmName: 'Game Ranch Pro Estates', farmOwner: 'GRP Management' }
];

export const INITIAL_RAINFALL_LOGS: RainfallLog[] = [
  { id: 'R001', date: getPastDate(5), amount: 15 },
  { id: 'R002', date: getPastDate(10), amount: 8 },
  { id: 'R003', date: getPastDate(35), amount: 22 },
  { id: 'R004', date: getPastDate(40), amount: 5 },
  { id: 'R005', date: getPastDate(65), amount: 30 },
];

export const INITIAL_VELD_ASSESSMENTS: VeldAssessment[] = [
    { id: 'VA001', habitatZoneId: 'H01', date: getPastDate(30), speciesComposition: 9, basalCover: 9, soilErosion: 4, condition: 'Excellent', forageUtilization: 'Light', isFixedPointSite: true, photoUrl: 'https://images.unsplash.com/photo-1507135848714-7621456c9b3a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'VA002', habitatZoneId: 'H02', date: getPastDate(45), speciesComposition: 7, basalCover: 8, soilErosion: 3, condition: 'Good', forageUtilization: 'Moderate' },
    { id: 'VA003', habitatZoneId: 'H04', date: getPastDate(20), speciesComposition: 6, basalCover: 6, soilErosion: 2, condition: 'Fair', forageUtilization: 'Heavy' },
    { id: 'VA004', habitatZoneId: 'H01', date: getPastDate(395), speciesComposition: 8, basalCover: 8, soilErosion: 4, condition: 'Good', forageUtilization: 'Light', isFixedPointSite: true, photoUrl: 'https://images.unsplash.com/photo-1628583421338-1644e54cd4a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

export const INITIAL_REPRODUCTIVE_EVENTS: ReproductiveEvent[] = [
    { id: 'RE001', offspringTagId: 'IMP-02', damTagId: 'IMP-01', sireTagId: 'IMP-M1', birthDate: getPastDate(1460), sex: 'Female', notes: 'Healthy birth.'}
];

export const INITIAL_ANIMAL_MEASUREMENTS: AnimalMeasurement[] = [
    { id: 'AM001', animalId: 'A002', date: getPastDate(180), measurementType: 'Horn Length (L)', value: 48.5, unit: 'in' },
    { id: 'AM002', animalId: 'A002', date: getPastDate(180), measurementType: 'Horn Length (R)', value: 49.0, unit: 'in' },
    { id: 'AM003', animalId: 'A008', date: getPastDate(90), measurementType: 'Body Weight', value: 250, unit: 'kg' },
];

export const INITIAL_POPULATION_SURVEYS: PopulationSurvey[] = [
    { id: 'PS001', date: getPastDate(60), species: 'Impala', method: 'Ground Count', estimatedCount: 120, maleCount: 40, femaleCount: 80, confidence: 'High' },
    { id: 'PS002', date: getPastDate(60), species: 'Kudu', method: 'Ground Count', estimatedCount: 45, maleCount: 15, femaleCount: 30, confidence: 'Medium' },
    { id: 'PS003', date: getPastDate(60), species: 'Blue Wildebeest', method: 'Aerial Count (Sample)', estimatedCount: 80, confidence: 'Medium' },
];

export const INITIAL_VETERINARY_LOGS: VeterinaryLog[] = [
    { id: 'VL001', date: getPastDate(90), animalId: 'A008', procedure: 'Vaccination', medicationUsed: 'Botuvax', dosage: '2ml', vetName: 'Dr. Annika Van Der Merwe' },
    { id: 'VL002', date: getPastDate(30), species: 'Sable Antelope', procedure: 'Deworming', medicationUsed: 'Ivermectin Pour-on', notes: 'Herd-wide treatment for parasites.'},
];

export const INITIAL_HEALTH_PROTOCOLS: HealthProtocol[] = [
    { id: 'HP001', name: 'Annual Brucellosis Testing', species: 'Sable Antelope', procedure: 'Brucellosis blood test', frequency: 'Annually', dueMonth: 'September' },
    { id: 'HP002', name: 'Bi-Annual Deworming', species: 'All', procedure: 'General dewormer application', frequency: 'Bi-Annually', dueMonth: 'March' }
];

// Map Data
export const INITIAL_LANDMARKS: Landmark[] = [
  { id: 'L01', type: LandmarkType.WaterTrough, name: 'North Trough', position: [30.52, -98.39] },
  { id: 'L02', type: LandmarkType.Gate, name: 'Main Gate', position: [30.50, -98.40] },
];
export const INITIAL_BOUNDARIES: Boundary[] = [
  { id: 'B01', name: 'Ranch Perimeter', positions: [[30.53, -98.41], [30.53, -98.37], [30.49, -98.37], [30.49, -98.41], [30.53, -98.41]] }
];

export const SPECIES_PARAMETERS = {
    'Kudu': { primeReproductiveAge: [4, 10], maxAge: 15, idealCalvingInterval: 365, growthRateLambda: 1.25 },
    'Impala': { primeReproductiveAge: [2, 7], maxAge: 12, idealCalvingInterval: 200, growthRateLambda: 1.35 },
    'Blue Wildebeest': { primeReproductiveAge: [3, 12], maxAge: 20, idealCalvingInterval: 365, growthRateLambda: 1.20 },
    'Sable Antelope': { primeReproductiveAge: [3, 12], maxAge: 18, idealCalvingInterval: 270, growthRateLambda: 1.15 },
};

export const SPECIES_BENCHMARKS = {
    'Kudu': {
        AverageLine: [{ age: 2, hornLength: 15 }, { age: 4, hornLength: 35 }, { age: 6, hornLength: 48 }, { age: 8, hornLength: 52 }, { age: 10, hornLength: 53 }],
        TrophyLine: [{ age: 2, hornLength: 20 }, { age: 4, hornLength: 45 }, { age: 6, hornLength: 55 }, { age: 8, hornLength: 60 }, { age: 10, hornLength: 61 }],
    }
};

export const SCI_FORMULAS: Record<string, { fields: {id: string, name: string}[], formula: (m: Record<string, number>) => number }> = {
    'Kudu': {
        fields: [
            { id: 'hornLengthL', name: 'Length of Left Horn' },
            { id: 'hornLengthR', name: 'Length of Right Horn' },
            { id: 'baseCircumferenceL', name: 'Circumference of Left Base' },
            { id: 'baseCircumferenceR', name: 'Circumference of Right Base' },
        ],
        formula: (m) => (m.hornLengthL || 0) + (m.hornLengthR || 0) + (m.baseCircumferenceL || 0) + (m.baseCircumferenceR || 0),
    }
};
