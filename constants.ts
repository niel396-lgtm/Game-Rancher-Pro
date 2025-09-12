

import { Animal, HabitatZone, InventoryItem, Transaction, TransactionType, Landmark, LandmarkType, Boundary, Task, Mortality, RainfallLog, VeldAssessment, Harvest, Client, Permit, ReproductiveEvent, AnimalMeasurement, PopulationSurvey, ProfessionalHunter, Hunt, VeterinaryLog, HealthProtocol, OfficialDocument, GameMeatProcessing, HuntTrack, RanchProfile, VerifiedProfessional, EcologicalRating, ClientReview, PHProfile } from './types';

export const RANCH_AREA_HECTARES = 5000;
export const GU_CONSUMPTION_RATE = 1650; // kg DM/year, based on Blue Wildebeest (1 GU)
export const BU_CONSUMPTION_RATE = 1300; // kg DM/year, based on Kudu (1 BU)

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

export const INITIAL_RANCH_PROFILES: RanchProfile[] = [
  {
    id: 'RP001',
    ranchId: 'RANCH01',
    isPublic: true,
    publicName: 'Game Rancher Pro Estates',
    province: 'Limpopo',
    shortDescription: 'A premier hunting and conservation destination focused on trophy Kudu and Sable.',
    photoGalleryUrls: [],
    speciesOffered: ['Kudu', 'Impala', 'Sable Antelope', 'Blue Wildebeest'],
    contactInfo: {
      email: 'contact@gamerancherpro.com',
      website: 'www.gamerancherpro.com'
    }
  },
  {
    id: 'RP002',
    ranchId: 'RANCH02',
    isPublic: true,
    publicName: 'Karoo Sustainable Safaris',
    province: 'Eastern Cape',
    shortDescription: 'Experience the rugged beauty of the Karoo with exceptional Springbok and Blesbok.',
    photoGalleryUrls: [],
    speciesOffered: ['Springbok', 'Blesbok', 'Kudu', 'Warthog'],
    contactInfo: {
      email: 'bookings@karoosafaris.co.za',
      phone: '+27 41 555 1234'
    }
  },
  {
    id: 'RP003',
    ranchId: 'RANCH03',
    isPublic: false,
    publicName: 'Bushveld Private Reserve',
    province: 'North West',
    shortDescription: 'A private, non-commercial reserve.',
    photoGalleryUrls: [],
    speciesOffered: ['Zebra', 'Giraffe'],
    contactInfo: {}
  }
];

export const INITIAL_VERIFIED_PROFESSIONALS: VerifiedProfessional[] = [
    { id: 'VP001', name: 'Dr. Annelize Van Der Merwe', credentials: 'SAVC #12345, Wildlife Veterinarian', isVerifiedProfessional: true },
    { id: 'VP002', name: 'Prof. Sipho Ndlovu', credentials: 'PhD Ecology, University of Cape Town', isVerifiedProfessional: true }
];

export const INITIAL_ECOLOGICAL_RATINGS: EcologicalRating[] = [
    {
        id: 'ER001',
        ranchId: 'RANCH01',
        professionalId: 'VP001',
        date: getPastDate(45),
        habitatCondition: 4,
        animalHealth: 5,
        managementPractices: 4,
        justificationNotes: 'Excellent animal health observed. Fencing and water management are good, but some early signs of bush encroachment in the western sector.'
    },
    {
        id: 'ER002',
        ranchId: 'RANCH02',
        professionalId: 'VP002',
        date: getPastDate(90),
        habitatCondition: 5,
        animalHealth: 4,
        managementPractices: 5,
        justificationNotes: 'Exemplary erosion control and habitat restoration work. Animal condition is good, reflecting the quality of the veld.'
    }
];

export const INITIAL_PERMITS: Permit[] = [
  { id: 'P001', permitNumber: 'CITES-ZA-2023-115', type: 'CITES', issueDate: '2023-08-01', expiryDate: '2024-07-31', linkedSpecies: ['Sable Antelope'], notes: 'Export permit for 2 males.' },
  { id: 'P002', permitNumber: 'WC-TOPS-2024-045', type: 'TOPS', issueDate: '2024-01-15', expiryDate: getFutureDate(45), linkedSpecies: [], notes: 'General TOPS hunting permit for the season.' },
  { id: 'P003', permitNumber: 'PROV-NC-2022-821', type: 'Provincial', issueDate: '2022-09-01', expiryDate: getPastDate(10), linkedSpecies: ['Impala', 'Kudu'], notes: 'Capture and translocation permit.' },
  { id: 'P004', permitNumber: 'OTHER-VET-2024-01', type: 'Other', issueDate: '2024-03-01', expiryDate: getFutureDate(120), linkedSpecies: [], notes: 'Veterinary import of specific medicines.' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'C001', name: 'John Doe', email: 'john.d@example.com', phone: '555-1234', visitDates: ['2023-10-18 to 2023-10-22'] },
  { id: 'C002', name: 'Jane Smith', email: 'jane.s@example.com', phone: '555-5678', visitDates: ['2024-02-10 to 2024-02-14'] },
  { id: 'C003', name: 'Carlos Gomez', email: 'carlos.g@example.com', phone: '555-8765', visitDates: ['2024-04-01 to 2024-04-05'] },
  { id: 'C004', name: 'Emily White', email: 'emily.w@example.com', phone: '555-4321', visitDates: ['2024-05-20 to 2024-05-25'] },
  { id: 'C005', name: 'Michael Brown', email: 'michael.b@example.com', phone: '555-1111', visitDates: [getPastDate(150)] },
  { id: 'C006', name: 'Sarah Davis', email: 'sarah.d@example.com', phone: '555-2222', visitDates: [getPastDate(120)] },
  { id: 'C007', name: 'David Wilson', email: 'david.w@example.com', phone: '555-3333', visitDates: [getPastDate(100)] },
];

export const INITIAL_PROFESSIONAL_HUNTERS: ProfessionalHunter[] = [
    { id: 'PH001', name: 'John Smith', licenseNumber: 'LP-12345', licenseExpiryDate: getFutureDate(300), provincialEndorsements: ['Limpopo', 'Mpumalanga'] },
    { id: 'PH002', name: 'Peter Jones', licenseNumber: 'FS-67890', licenseExpiryDate: getFutureDate(45), provincialEndorsements: ['Free State', 'KwaZulu-Natal'] },
    { id: 'PH003', name: 'David Miller', licenseNumber: 'EC-54321', licenseExpiryDate: getPastDate(10), provincialEndorsements: ['Eastern Cape'] },
];

export const INITIAL_PH_PROFILES: PHProfile[] = [
  {
    id: 'PHP001',
    phId: 'PH001',
    isPublic: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256',
    biography: 'A seasoned professional with over 20 years of experience in the Limpopo and Mpumalanga bushveld. Specializes in ethical, walk-and-stalk hunts for Big 5 game.',
    yearsOfExperience: 22,
    languages: ['English', 'Afrikaans'],
    specializations: ['Dangerous Game', 'Rifle Hunting', 'Tracking']
  },
  {
    id: 'PHP002',
    phId: 'PH002',
    isPublic: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256',
    biography: 'An expert bow hunter with a passion for plains game. Peter has guided clients from all over the world in the challenging terrains of the Free State and KZN.',
    yearsOfExperience: 15,
    languages: ['English', 'German'],
    specializations: ['Bow Hunting', 'Plains Game', 'Mountain Game']
  },
  {
    id: 'PHP003',
    phId: 'PH003',
    isPublic: false,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256',
    biography: 'Specialist in ethical culling and problem animal control in the Eastern Cape.',
    yearsOfExperience: 18,
    languages: ['English', 'Xhosa'],
    specializations: ['Culling Operations', 'Problem Animal Control']
  }
];


export const INITIAL_HUNTS: Hunt[] = [
    {
        id: 'HUNT001',
        ranchId: 'RANCH01',
        clientId: 'C001',
        professionalHunterId: 'PH001',
        permitIds: ['P002'],
        startDate: '2023-10-18',
        endDate: '2023-10-22',
        status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: true, provincialLicenseAcquired: true, indemnityPdfUrl: '#' },
        notes: 'Successful Kudu hunt.'
    },
    {
        id: 'HUNT002',
        ranchId: 'RANCH01',
        clientId: 'C002',
        professionalHunterId: 'PH002',
        permitIds: ['P002'],
        startDate: getPastDate(90),
        endDate: getPastDate(86),
        status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: false, provincialLicenseAcquired: true, },
        notes: 'Successful Impala hunt.'
    },
    {
        id: 'HUNT003',
        ranchId: 'RANCH02',
        clientId: 'C003',
        professionalHunterId: 'PH003',
        permitIds: [],
        startDate: getPastDate(60),
        endDate: getPastDate(56),
        status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: true, provincialLicenseAcquired: true, },
        notes: 'Springbok cull completed.'
    },
     {
        id: 'HUNT004',
        ranchId: 'RANCH02',
        clientId: 'C004',
        professionalHunterId: 'PH003',
        permitIds: [],
        startDate: getPastDate(10),
        endDate: getPastDate(5),
        status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: true, provincialLicenseAcquired: true, },
        notes: 'Warthog hunt.'
    },
    // Hunts for PH001 to make him "Top Rated"
    {
        id: 'HUNT005', ranchId: 'RANCH01', clientId: 'C005', professionalHunterId: 'PH001', permitIds: [],
        startDate: getPastDate(150), endDate: getPastDate(145), status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: true, provincialLicenseAcquired: true, }, notes: 'Sable hunt.'
    },
    {
        id: 'HUNT006', ranchId: 'RANCH01', clientId: 'C006', professionalHunterId: 'PH001', permitIds: [],
        startDate: getPastDate(120), endDate: getPastDate(115), status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: true, provincialLicenseAcquired: true, }, notes: 'Blue Wildebeest hunt.'
    },
    {
        id: 'HUNT007', ranchId: 'RANCH01', clientId: 'C007', professionalHunterId: 'PH001', permitIds: [],
        startDate: getPastDate(100), endDate: getPastDate(95), status: 'Completed',
        checklist: { indemnitySigned: true, firearmPermitVerified: true, provincialLicenseAcquired: true, }, notes: 'Second Kudu hunt for this group.'
    }
];

export const INITIAL_CLIENT_REVIEWS: ClientReview[] = [
    { id: 'CR001', huntId: 'HUNT001', ranchId: 'RANCH01', overallRating: 5, comment: 'Incredible experience, the PH was top-notch and the animals were in amazing condition.', isAnonymous: true, date: getPastDate(200), phRating: 5, phComment: 'John was a phenomenal guide. Knowledgeable, patient, and ethical.' },
    { id: 'CR002', huntId: 'HUNT002', ranchId: 'RANCH01', overallRating: 4, comment: 'Great hunt, beautiful property. Would have liked to see more mature animals.', isAnonymous: true, date: getPastDate(80), phRating: 4, phComment: 'Peter was good.' },
    { id: 'CR003', huntId: 'HUNT003', ranchId: 'RANCH02', overallRating: 5, comment: 'The Karoo is breathtaking. Very professional outfit, everything was perfect.', isAnonymous: true, date: getPastDate(50), phRating: 5 },
    { id: 'CR004', huntId: 'HUNT004', ranchId: 'RANCH02', overallRating: 4, comment: 'Good value and a successful hunt. The accommodation was a bit rustic for my taste.', isAnonymous: true, date: getPastDate(2), phRating: 4 },
    // Extra reviews to make RANCH01 and PH001 "Top Rated"
    { id: 'CR005', huntId: 'HUNT005', ranchId: 'RANCH01', overallRating: 5, isAnonymous: true, date: getPastDate(140), phRating: 5, phComment: 'Best PH in the business.' },
    { id: 'CR006', huntId: 'HUNT006', ranchId: 'RANCH01', overallRating: 5, isAnonymous: true, date: getPastDate(110), phRating: 5, phComment: 'Unforgettable experience thanks to John.' },
    { id: 'CR007', huntId: 'HUNT007', ranchId: 'RANCH01', overallRating: 4, comment: 'Tough hunt but rewarding.', isAnonymous: true, date: getPastDate(90), phRating: 5, phComment: 'John worked tirelessly to find my animal. A true professional.' },
];


export const INITIAL_ANIMALS: Animal[] = [
  { id: 'A001', species: 'Impala', age: 9, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'IMP-01', forageType: 'Mixed-Feeder', guEquivalent: 0.2, buEquivalent: 0.2, category: 'Breeding Stock' },
  { id: 'A002', species: 'Kudu', age: 5, sex: 'Male', health: 'Good', conditionScore: 4, location: 'West Ridge', tagId: 'KDU-07', forageType: 'Browser', buEquivalent: 1.0, category: 'Trophy' },
  { id: 'A003', species: 'Blue Wildebeest', age: 6, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'BWB-15', forageType: 'Grazer', guEquivalent: 1.0, category: 'Production' },
  { id: 'A004', species: 'Warthog', age: 2, sex: 'Female', health: 'Good', conditionScore: 4, location: 'Oak Forest', tagId: 'WHG-21', forageType: 'Mixed-Feeder', guEquivalent: 0.15, buEquivalent: 0.05, category: 'Production' },
  { id: 'A005', species: 'Blesbok', age: 4, sex: 'Male', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'BLK-11', forageType: 'Grazer', guEquivalent: 0.4, category: 'Production' },
  { id: 'A006', species: 'Kudu', age: 10, sex: 'Female', health: 'Excellent', conditionScore: 5, location: 'West Ridge', tagId: 'KDU-08', forageType: 'Browser', buEquivalent: 1.0, category: 'Breeding Stock' },
  { id: 'A007', species: 'Impala', age: 4, sex: 'Female', health: 'Good', conditionScore: 4, location: 'North Pasture', tagId: 'IMP-02', forageType: 'Mixed-Feeder', guEquivalent: 0.2, buEquivalent: 0.2, damId: 'A001', sireId: 'A009', category: 'Breeding Stock' },
  { id: 'A008', species: 'Sable Antelope', age: 5, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'South Plains', tagId: 'SBL-01', forageType: 'Grazer', guEquivalent: 0.8, category: 'Breeding Stock' },
  { id: 'A009', species: 'Impala', age: 5, sex: 'Male', health: 'Excellent', conditionScore: 5, location: 'North Pasture', tagId: 'IMP-M1', forageType: 'Mixed-Feeder', guEquivalent: 0.2, buEquivalent: 0.2, category: 'Breeding Stock', sireId: 'A009' /* Example of inbreeding */ },
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
// FIX: Add missing farmName and farmOwner properties to comply with Harvest type
export const INITIAL_HARVESTS: Harvest[] = [
    { id: 'H001', animalTagId: 'KDU-07', species: 'Kudu', sex: 'Male', date: '2023-10-20', professionalHunterId: 'PH001', method: 'Rifle', trophyMeasurements: 'Rowland Ward', location: 'West Ridge', locality: 'Near the old windmill', hornLengthL: 54.5, hornLengthR: 55.0, tipToTipSpread: 32.0, clientId: 'C001', photoUrl: 'https://images.unsplash.com/photo-1590393278637-1355', farmName: 'Game Rancher Pro Estates', farmOwner: 'GRP Management' },
];

// FIX: Define and export missing initial data arrays
export const INITIAL_LANDMARKS: Landmark[] = [];
export const INITIAL_BOUNDARIES: Boundary[] = [];
export const INITIAL_HUNT_TRACKS: HuntTrack[] = [];
export const INITIAL_RAINFALL_LOGS: RainfallLog[] = [
  { id: 'RL01', date: getPastDate(30), amount: 15 },
  { id: 'RL02', date: getPastDate(25), amount: 22 },
  { id: 'RL03', date: getPastDate(10), amount: 8 },
];
export const INITIAL_VELD_ASSESSMENTS: VeldAssessment[] = [];
export const INITIAL_REPRODUCTIVE_EVENTS: ReproductiveEvent[] = [];
export const INITIAL_ANIMAL_MEASUREMENTS: AnimalMeasurement[] = [
    { id: 'AM001', animalId: 'A002', date: getPastDate(180), measurementType: 'Horn Length (L)', value: 52, unit: 'in' },
    { id: 'AM002', animalId: 'A002', date: getPastDate(180), measurementType: 'Horn Length (R)', value: 52.5, unit: 'in' },
    { id: 'AM003', animalId: 'A002', date: getPastDate(10), measurementType: 'Horn Length (L)', value: 54.5, unit: 'in' },
    { id: 'AM004', animalId: 'A002', date: getPastDate(10), measurementType: 'Horn Length (R)', value: 55, unit: 'in' },
];
export const INITIAL_POPULATION_SURVEYS: PopulationSurvey[] = [
    { id: 'PS001', date: getPastDate(90), species: 'Kudu', method: 'Ground Count', estimatedCount: 75, maleCount: 20, femaleCount: 45, juvenileCount: 10, confidence: 'Medium' },
    { id: 'PS002', date: getPastDate(90), species: 'Impala', method: 'Ground Count', estimatedCount: 250, confidence: 'High' },
];
export const INITIAL_VETERINARY_LOGS: VeterinaryLog[] = [];
export const INITIAL_HEALTH_PROTOCOLS: HealthProtocol[] = [];
export const INITIAL_OFFICIAL_DOCUMENTS: OfficialDocument[] = [];
export const INITIAL_GAME_MEAT_PROCESSING: GameMeatProcessing[] = [];


// FIX: Define and export missing constants used across various components
export const SPECIES_PARAMETERS = {
    Kudu: {
        primeReproductiveAge: [4, 9], // years
        maxAge: 12,
        idealCalvingInterval: 365, // days
        growthRateLambda: 1.25, // 25% annual growth potential
        harvestStrategy: {
            male: { 'Past-Prime': 0.75, 'Sub-Adult': 0.20, 'Prime': 0.05 },
            female: { 'Past-Prime': 0.80, 'Prime': 0.15, 'Sub-Adult': 0.05 }
        }
    },
    Impala: {
        primeReproductiveAge: [2, 6],
        maxAge: 8,
        idealCalvingInterval: 200, // days
        growthRateLambda: 1.35,
        harvestStrategy: {
            male: { 'Past-Prime': 0.60, 'Sub-Adult': 0.30, 'Prime': 0.10 },
            female: { 'Past-Prime': 0.70, 'Prime': 0.25, 'Sub-Adult': 0.05 }
        }
    },
    'Blue Wildebeest': {
        primeReproductiveAge: [3, 10],
        maxAge: 15,
        idealCalvingInterval: 365, // days
        growthRateLambda: 1.20,
        harvestStrategy: {
            male: { 'Past-Prime': 0.80, 'Sub-Adult': 0.15, 'Prime': 0.05 },
            female: { 'Past-Prime': 0.90, 'Prime': 0.10, 'Sub-Adult': 0.00 }
        }
    }
};

export const SPECIES_BENCHMARKS = {
    Kudu: {
        AverageLine: [
            { age: 3, hornLength: 30 },
            { age: 4, hornLength: 40 },
            { age: 5, hornLength: 48 },
            { age: 6, hornLength: 52 },
            { age: 7, hornLength: 55 },
            { age: 8, hornLength: 56 },
        ],
        TrophyLine: [
            { age: 3, hornLength: 35 },
            { age: 4, hornLength: 45 },
            { age: 5, hornLength: 53 },
            { age: 6, hornLength: 58 },
            { age: 7, hornLength: 60 },
            { age: 8, hornLength: 61 },
        ],
    },
};

export const SCI_FORMULAS: Record<string, { fields: {id: string, name: string}[], formula: (m: Record<string, number>) => number }> = {
    Kudu: {
        fields: [
            { id: 'hornLengthL', name: 'Length of Left Horn' },
            { id: 'hornLengthR', name: 'Length of Right Horn' },
            { id: 'baseCircumferenceL', name: 'Circumference of Left Base' },
            { id: 'baseCircumferenceR', name: 'Circumference of Right Base' },
        ],
        formula: (m) => (m.hornLengthL || 0) + (m.hornLengthR || 0) + (m.baseCircumferenceL || 0) + (m.baseCircumferenceR || 0),
    },
    Impala: {
        fields: [
            { id: 'hornLengthL', name: 'Length of Left Horn' },
            { id: 'hornLengthR', name: 'Length of Right Horn' },
            { id: 'baseCircumferenceL', name: 'Circumference of Left Base' },
            { id: 'baseCircumferenceR', name: 'Circumference of Right Base' },
        ],
        formula: (m) => (m.hornLengthL || 0) + (m.hornLengthR || 0) + (m.baseCircumferenceL || 0) + (m.baseCircumferenceR || 0),
    }
};
