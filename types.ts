
import { Coords } from './RanchMap';

export enum View {
  Dashboard = 'Dashboard',
  Animals = 'Animals',
  PopulationSurveys = 'Population Surveys',
  Clients = 'Clients',
  Permits = 'Permits & Compliance',
  Habitat = 'Habitat',
  Inventory = 'Inventory',
  Finance = 'Finance',
  AIAssistant = 'AI Assistant',
  RanchMap = 'Ranch Map',
  GeneticAnalysis = 'Genetic Analysis',
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
  date: string;
  professionalHunterId: string;
  clientId?: string;
  method: string;
  trophyMeasurements: string; // e.g., SCI Score, Rowland Ward
  location: string;
  coordinates?: Coords;
  hornLengthL?: number; // Optional: Left Horn Length in inches
  hornLengthR?: number; // Optional: Right Horn Length in inches
  baseCircumferenceL?: number; // Optional: Left Base Circumference
  baseCircumferenceR?: number; // Optional: Right Base Circumference
  tipToTipSpread?: number; // Optional: Spread measurement
  photoUrl?: string;
  huntId?: string;
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
