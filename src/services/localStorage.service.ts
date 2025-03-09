import { Store } from '../types/store.types';
import { SKU } from '../types/sku.types';
import { Week, PlanningData } from '../types/planning.types';

const STORES_KEY = 'gsynergy_stores';
const SKUS_KEY = 'gsynergy_skus';
const WEEKS_KEY = 'gsynergy_weeks';
const PLANNING_DATA_KEY = 'gsynergy_planning_data';
const AUTH_KEY = 'gsynergy_auth';

// Stores
export const saveStores = (stores: Store[]): void => {
  localStorage.setItem(STORES_KEY, JSON.stringify(stores));
};

export const getStores = (): Store[] => {
  const stores = localStorage.getItem(STORES_KEY);
  return stores ? JSON.parse(stores) : [];
};

// SKUs
export const saveSKUs = (skus: SKU[]): void => {
  localStorage.setItem(SKUS_KEY, JSON.stringify(skus));
};

export const getSKUs = (): SKU[] => {
  const skus = localStorage.getItem(SKUS_KEY);
  return skus ? JSON.parse(skus) : [];
};

// Weeks
export const saveWeeks = (weeks: Week[]): void => {
  localStorage.setItem(WEEKS_KEY, JSON.stringify(weeks));
};

export const getWeeks = (): Week[] => {
  const weeks = localStorage.getItem(WEEKS_KEY);
  return weeks ? JSON.parse(weeks) : [];
};

// Planning Data
export const savePlanningData = (data: PlanningData[]): void => {
  localStorage.setItem(PLANNING_DATA_KEY, JSON.stringify(data));
};

export const getPlanningData = (): PlanningData[] => {
  const data = localStorage.getItem(PLANNING_DATA_KEY);
  return data ? JSON.parse(data) : [];
};

// Auth
export const saveAuth = (username: string): void => {
  localStorage.setItem(AUTH_KEY, username);
};

export const getAuth = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};