/**
 * Secure storage utilities for tokens and user data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@expense_tracker:access_token';
const REFRESH_TOKEN_KEY = '@expense_tracker:refresh_token';
const USER_KEY = '@expense_tracker:user';

export const tokenStorage = {
  /**
   * Get access token from storage.
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Save access token to storage.
   */
  setToken: async (token: string): Promise<void> => {
    if (!token) {
      throw new Error('Token cannot be empty or undefined');
    }
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  },

  /**
   * Get refresh token from storage.
   */
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  /**
   * Save refresh token to storage.
   */
  setRefreshToken: async (token: string): Promise<void> => {
    if (!token) {
      throw new Error('Refresh token cannot be empty or undefined');
    }
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
      throw error;
    }
  },

  /**
   * Remove all tokens from storage.
   */
  clearTokens: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },

  /**
   * Check if user is authenticated.
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await tokenStorage.getToken();
    return token !== null;
  },
};

export const userStorage = {
  /**
   * Get user data from storage.
   */
  getUser: async <T>(): Promise<T | null> => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Save user data to storage.
   */
  setUser: async <T>(user: T): Promise<void> => {
    if (!user || (typeof user === 'object' && Object.keys(user).length === 0)) {
      throw new Error('User data cannot be empty or undefined');
    }
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  },

  /**
   * Remove user data from storage.
   */
  clearUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  },
};

/**
 * Clear all app data from storage.
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
