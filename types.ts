
export enum View {
  Dashboard = 'Dashboard',
  Animals = 'Animals',
  Habitat = 'Habitat',
  Inventory = 'Inventory',
  Finance = 'Finance',
  AIAssistant = 'AI Assistant',
  RanchMap = 'Ranch Map',
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
}

export interface HabitatZone {
  id: string;
  name: string;
  waterLevel: 'High' | 'Normal' | 'Low';
  forageQuality: 'Abundant' | 'Moderate' | 'Scarce';
  veldCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  issues: string[];
  carryingCapacity: number; // Max animals
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
  method: string;
  trophyMeasurements: string; // e.g., SCI Score, Rowland Ward
  location: string;
  hornLengthL?: number; // Optional: Left Horn Length in inches
  hornLengthR?: number; // Optional: Right Horn Length in inches
  tipToTipSpread?: number; // Optional: Spread measurement
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
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
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