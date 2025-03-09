import { LoginCredentials } from '../types/auth.types';

// In a real application, this would be an API call
export const loginUser = (credentials: LoginCredentials): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple validation for demo purposes
      if (credentials.username && credentials.password) {
        resolve(credentials.username);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};