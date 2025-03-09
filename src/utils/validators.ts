// src/utils/validators.ts
import { Store } from '../types/store.types';
import { SKU } from '../types/sku.types';

// Validate store data
export const validateStoreData = (store: Partial<Store>, existingStores: Store[] = []): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!store.id?.trim()) {
    errors.id = 'Store ID is required';
  } else if (existingStores.some(s => s.id === store.id && s.seqNo !== store.seqNo)) {
    errors.id = 'Store ID must be unique';
  }
  
  if (!store.label?.trim()) {
    errors.label = 'Store label is required';
  }
  
  if (!store.city?.trim()) {
    errors.city = 'City is required';
  }
  
  if (!store.state?.trim()) {
    errors.state = 'State is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate SKU data
export const validateSKUData = (sku: Partial<SKU>, existingSKUs: SKU[] = []): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!sku.id?.trim()) {
    errors.id = 'SKU ID is required';
  } else if (existingSKUs.some(s => s.id === sku.id)) {
    errors.id = 'SKU ID must be unique';
  }
  
  if (!sku.label?.trim()) {
    errors.label = 'SKU label is required';
  }
  
  if (!sku.class?.trim()) {
    errors.class = 'Class is required';
  }
  
  if (!sku.department?.trim()) {
    errors.department = 'Department is required';
  }
  
  if (sku.price === undefined || sku.price === null) {
    errors.price = 'Price is required';
  } else if (isNaN(Number(sku.price)) || Number(sku.price) < 0) {
    errors.price = 'Price must be a positive number';
  }
  
  if (sku.cost === undefined || sku.cost === null) {
    errors.cost = 'Cost is required';
  } else if (isNaN(Number(sku.cost)) || Number(sku.cost) < 0) {
    errors.cost = 'Cost must be a positive number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate login credentials
export const validateLoginCredentials = (username: string, password: string): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!username.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!password.trim()) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate file type for import
export const validateFileType = (file: File): boolean => {
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  return validTypes.includes(file.type);
};