
export enum View {
  Dashboard = 'Dashboard',
  Animals = 'Animals',
  Clients = 'Clients',
  Permits = 'Permits & Compliance',
  Habitat = 'Habitat',
  Inventory = 'Inventory',
  Finance = 'Finance',
  AIAssistant = 'AI Assistant',
  RanchMap = 'Ranch Map',
}

export interface Permit {
  id: string;
  permitNumber: string;
  type: 'TOPS' | 'CITES' | 'Provincial' | 'Other';
  issueDate: string;
  expiryDate: string;
  linkedSpecies: string[];
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
  sireId?: string; // ID of the father for genetic tracking
  damId?: string;  // ID of the mother for genetic tracking
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
  hunter: string;
  clientId?: string;
  method: string;
  trophyMeasurements: string; // e.g., SCI Score, Rowland Ward
  location: string;
  hornLengthL?: number; // Optional: Left Horn Length in inches
  hornLengthR?: number; // Optional: Right Horn Length in inches
  tipToTipSpread?: number; // Optional: Spread measurement
  permitId?: string;
  photoUrl?: string;
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