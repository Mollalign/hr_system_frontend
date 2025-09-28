import type { User } from '../types';

// Authentication utility functions

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  company: string;
  address: string;
  isActive: boolean;
  createdAt: string;  
  updatedAt: string;
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

// Convert User to StoredUser
export const userToStoredUser = (user: User): StoredUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  phone: user.phone,
  company: user.company,
  address: user.address,
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

// Convert StoredUser to User
export const storedUserToUser = (storedUser: StoredUser): User => ({
  id: storedUser.id,
  username: storedUser.username,
  email: storedUser.email,
  role: storedUser.role as any, // Assuming UserRole is compatible
  firstName: storedUser.firstName,
  lastName: storedUser.lastName,
  fullName: storedUser.fullName,
  phone: storedUser.phone,
  company: storedUser.company,
  address: storedUser.address,
  isActive: storedUser.isActive,
  createdAt: new Date(storedUser.createdAt),
  updatedAt: new Date(storedUser.updatedAt),
});

// Token management
export const getStoredTokens = (): StoredTokens | null => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return null;
  }
};

export const setStoredTokens = (tokens: StoredTokens): void => {
  try {
    localStorage.setItem('authToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  } catch (error) {
    console.error('Error setting stored tokens:', error);
  }
};

export const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error clearing stored tokens:', error);
  }
};

// User data management
export const getStoredUser = (): StoredUser | null => {
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  try {
    const storedUser = userToStoredUser(user);
    localStorage.setItem('userData', JSON.stringify(storedUser));
  } catch (error) {
    console.error('Error setting stored user:', error);
  }
};

export const clearStoredUser = (): void => {
  try {
    localStorage.removeItem('userData');
  } catch (error) {
    console.error('Error clearing stored user:', error);
  }
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

// Clear all auth data
export const clearAllAuthData = (): void => {
  clearStoredTokens();
  clearStoredUser();
  clearAuthToken();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const tokens = getStoredTokens();
  const user = getStoredUser();
  return !!(tokens && user);
};

// Get token expiration time (if JWT)
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    return null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  // Add 5 minute buffer
  return new Date() > new Date(expiration.getTime() - 5 * 60 * 1000);
};
