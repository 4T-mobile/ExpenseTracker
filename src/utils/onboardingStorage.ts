/**
 * Storage utilities for onboarding state persistence.
 * Tracks user progress through the onboarding flow and ensures
 * the onboarding is only shown once per user.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@expense_tracker:onboarding_state';

export interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  completedAt?: string;
}

const DEFAULT_STATE: OnboardingState = {
  currentStep: 0,
  isCompleted: false,
};

export const onboardingStorage = {
  /**
   * Get the current onboarding state from storage.
   */
  getState: async (): Promise<OnboardingState> => {
    try {
      const stateJson = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!stateJson) return DEFAULT_STATE;
      return JSON.parse(stateJson);
    } catch (error) {
      console.error('Error getting onboarding state:', error);
      return DEFAULT_STATE;
    }
  },

  /**
   * Update the current step in the onboarding flow.
   */
  setCurrentStep: async (step: number): Promise<void> => {
    try {
      const currentState = await onboardingStorage.getState();
      const newState: OnboardingState = {
        ...currentState,
        currentStep: step,
      };
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error setting onboarding step:', error);
    }
  },

  /**
   * Mark the onboarding as completed.
   */
  markAsCompleted: async (): Promise<void> => {
    try {
      const newState: OnboardingState = {
        currentStep: 0,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
    }
  },

  /**
   * Check if onboarding has been completed.
   */
  isCompleted: async (): Promise<boolean> => {
    const state = await onboardingStorage.getState();
    return state.isCompleted;
  },

  /**
   * Reset onboarding state (useful for testing).
   */
  reset: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },
};
