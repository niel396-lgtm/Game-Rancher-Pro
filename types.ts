import { Coords } from './RanchMap';

export enum View {
  Dashboard = 'Dashboard',
  Animals = 'Animals',
  VeterinaryLog = 'Veterinary Log',
  PopulationSurveys = 'Population Surveys',
  Clients = 'Clients',
  Permits = 'Permits & Compliance',
  Documents = 'Documents',
  Habitat = 'Habitat',
  Inventory = 'Inventory',
  Finance = 'Finance',
  GameMeat = 'Game Meat Processing',
  BioeconomicsReport = 'Bio-Economics',
  AIAssistant = 'AI Assistant',
  RanchMap = 'Ranch Map',
  StudBook = 'Stud Book',
  HarvestPlanning = 'Harvest Planning',
  PHManagement = 'PH Management',
  HuntRegister = 'Hunt Register',
  AnnualReport = 'Annual Report',
}

export type ManagementStyle = 'Intensive' | 'Extensive';

export interface Permit {
  id: string;
  permitNumber: string;
  type: 'TOPS' | 'CITES' | 'Provincial' | 'Other';
  issueDate: string;
  expiryDate: string;
  linkedSpecies: string[];
  notes?: string;
}

export interface OfficialDocument {
    id: string;
    fileName: string;
    category: 'Indemnity' | 'Insurance' | 'Firearm Permit' | 'CITES Permit' | 'Veterinary' | 'Other';
    uploadDate: string;
    expiryDate?: string;
    linkedClientId?: string;
    linkedPhId?: string;
    linkedHuntId?: string;
    fileUrl: string; // URL to the stored document
    notes?: string;
}

export interface ProfessionalHunter {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  provincialEndorsements: string[];
}

export interface Hunt {
    id: string;
    clientId: string;
    professionalHunterId: string;
    permitIds: string[];
    startDate: string;
    endDate: string;
    status: 'Planned' | 'Active' | 'Completed';
    checklist: {
        indemnitySigned: boolean;
        firearmPermitVerified: boolean;
        provincialLicenseAcquired: boolean;
        indemnityPdfUrl?: string;
    };
    notes?: string;
}


export interface Animal {
  id: string;
  species: string;
  age: number;
  sex: 'Male' | 'Female';
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  conditionScore: number; // 1-5 scale
  location: string;
  tagId: string;
  forageType: 'Grazer' | 'Browser' | 'Mixed-Feeder';
  lsuEquivalent: number; // e.g., Kudu = 0.7, Impala = 0.25
  lsuConsumptionRate: number; // kg of dry matter consumed per year
  sireId?: string; // ID of the father for genetic tracking
  damId?: string;  // ID of the mother for genetic tracking
  category: 'Breeding Stock' | 'Juvenile' | 'Trophy' | 'Production';
}

export interface HabitatZone {
  id: string;
  name: string;
  waterLevel: 'High' | 'Normal' | 'Low';
  forageQuality: 'Abundant' | 'Moderate' | 'Scarce';
  veldCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  issues: string[];
  areaHectares: number;
  forageProductionFactor: number; // kg dry matter per ha per mm rain
  grassToBrowseRatio: number; // 0.0 to 1.0, proportion of forage for grazers
}

export interface InventoryItem {
  id:string;
  name: string;
  category: 'Feed' | 'Medicine' | 'Equipment' | 'Other';
  quantity: number;
  reorderLevel: number;
  supplier: string;
}

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  visitDates: string[]; // Array of strings like "YYYY-MM-DD to YYYY-MM-DD"
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  linkedAnimalId?: string;
  linkedHabitatId?: string;
  linkedInventoryId?: string;
  clientId?: string;
  permitId?: string;
  linkedSpecies?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Mortality {
  id: string;
  animalTagId: string;
  species: string;
  date: string;
  cause: string;
  location: string;
}

export interface Harvest {
  id: string;
  animalTagId: string;
  species: string;
  sex: 'Male' | 'Female';
  date: string;
  professionalHunterId: string;
  clientId?: string;
  method: 'Rifle' | 'Bow' | 'Crossbow' | 'Muzzleloader' | 'Handgun';
  trophyMeasurements: string; // e.g., SCI Score, Rowland Ward
  location: string; // Habitat Zone
  locality: string; // Specific locality of harvest on the ranch
  coordinates?: Coords;
  hornLengthL?: number; // Optional: Left Horn Length in inches
  hornLengthR?: number; // Optional: Right Horn Length in inches
  baseCircumferenceL?: number; // Optional: Left Base Circumference
  baseCircumferenceR?: number; // Optional: Right Base Circumference
  tipToTipSpread?: number; // Optional: Spread measurement
  photoUrl?: string; // Field photo
  huntId?: string;
  farmName: string;
  farmOwner: string;
  clientSignature?: string; // URL to scanned signature
  phSignature?: string; // URL to scanned signature
  witness?: string;
  sciMeasurerId?: string; // Official SCI Measurer Number
  dateMeasured?: string;
}

export interface RainfallLog {
  id: string;
  date: string;
  amount: number; // in mm
}

export interface VeldAssessment {
  id: string;
  habitatZoneId: string;
  date: string;
  speciesComposition: number; // Score out of 10
  basalCover: number; // Score out of 10
  soilErosion: number; // Score out of 5
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  forageUtilization: 'Light' | 'Moderate' | 'Heavy' | 'Severe';
  isFixedPointSite?: boolean;
  photoUrl?: string;
  notes?: string;
}

export interface ReproductiveEvent {
  id: string;
  offspringTagId: string;
  damTagId: string;
  sireTagId?: string;
  birthDate: string;
  sex: 'Male' | 'Female';
  notes?: string;
}

export interface AnimalMeasurement {
  id: string;
  animalId: string;
  date: string;
  measurementType: 'Horn Length (L)' | 'Horn Length (R)' | 'Tip-to-Tip Spread' | 'Body Weight';
  value: number;
  unit: 'in' | 'kg';
  notes?: string;
}

export interface PopulationSurvey {
  id: string;
  date: string;
  habitatZoneId?: string; // Optional: can be a ranch-wide survey
  species: string;
  method: 'Aerial Count (Total)' | 'Aerial Count (Sample)' | 'Ground Count' | 'Camera Trap Estimate' | 'Dung/Spore Count';
  estimatedCount: number;
  maleCount?: number;
  femaleCount?: number;
  juvenileCount?: number;
  confidence: 'High' | 'Medium' | 'Low';
  notes?: string;
}

export interface VeterinaryLog {
    id: string;
    date: string;
    animalId?: string; // For individual treatments
    species?: string; // For herd treatments
    procedure: 'Vaccination' | 'Deworming' | 'Disease Testing' | 'Treatment' | 'Check-up' | 'Immobilization' | 'Translocation';
    diagnosis?: string; // e.g., 'Suspected Heartwater'
    clinicalSigns?: string; // e.g., 'Lethargy, fever'
    labTest?: string; // e.g., 'Blood Smear', 'PCR'
    testResult?: 'Positive' | 'Negative' | 'Pending';
    medicationUsed?: string;
    dosage?: string;
    drugWithdrawalPeriod?: string; // e.g., '21 days'
    vetName?: string;
    vetPracticeNumber?: string; // Essential for official records
    notes?: string;
}

export interface HealthProtocol {
    id: string;
    name: string;
    species: string; // e.g., 'Sable Antelope' or 'All'
    procedure: string; // e.g., 'Brucellosis testing'
    frequency: 'Annually' | 'Bi-Annually' | 'Quarterly';
    dueMonth: string; // e.g., 'September'
}

export interface GameMeatSale {
  id: string;
  buyer: string;
  invoiceNumber: string;
  date: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  notes?: string;
}

export interface GameMeatProcessing {
  id: string;
  harvestId: string;
  animalTagId: string;
  species: string;
  liveWeightKg?: number;
  carcassWeightKg: number;
  processedWeightKg?: number;
  processingDate: string;
  processedBy: string;
  status: 'Awaiting Processing' | 'In Process' | 'Processed' | 'Partially Sold' | 'Sold';
  sales: GameMeatSale[];
}


// Types for the new mapping feature
export type Coords = [number, number];
export type CoordsPath = Coords[];

export enum LandmarkType {
  WaterTrough = 'Water Trough',
  Dam = 'Dam',
  Pump = 'Pump',
  Gate = 'Gate',
  HuntingHide = 'Hunting Hide',
  Other = 'Other',
}

export interface Landmark {
  id: string;
  type: LandmarkType;
  name: string;
  position: Coords;
}

export interface Boundary {
  id: string;
  name: string;
  positions: CoordsPath;
}

export enum WaypointCategory {
  Sighting = 'Sighting',
  BrokenFence = 'Broken Fence',
  PoachingSign = 'Poaching Sign',
  WaterIssue = 'Water Issue',
  Infrastructure = 'Infrastructure',
  Other = 'Other',
}

export interface Waypoint {
  id: string;
  category: WaypointCategory;
  position: Coords;
  title: string;
  notes?: string;
  date: string;
}