import { create } from 'zustand';

export interface OnboardingState {
  step: number;
  basicInfo: {
    name: string;
    age: string;
    language: string;
  };
  healthProfile: {
    sex: 'female' | 'non-binary' | '';
    menstrualStatus: 'menstruating' | 'not-menstruating' | '';
    cycleRegularity: 'regular' | 'irregular' | 'unknown' | '';
    cycleLength: string;
    periodDuration: string;
    reproductiveStatus: {
      tryingToConceive: boolean;
      pregnant: boolean;
      conditions: string[];
    };
  };
  goals: {
    primary: string;
    secondary: string[];
  };
  mentalHealth: {
    currentState: string;
    supportPreference: string[];
  };
  lifestyle: {
    activityLevel: 'sedentary' | 'moderate' | 'active' | '';
    sleepPattern: 'regular' | 'irregular' | '';
    averageSleep: string;
  };
  privacy: {
    dataConsent: boolean;
    notifications: boolean;
    contact: string;
  };
  setStep: (step: number) => void;
  updateBasicInfo: (data: Partial<OnboardingState['basicInfo']>) => void;
  updateHealthProfile: (data: Partial<OnboardingState['healthProfile']>) => void;
  updateGoals: (data: Partial<OnboardingState['goals']>) => void;
  updateMentalHealth: (data: Partial<OnboardingState['mentalHealth']>) => void;
  updateLifestyle: (data: Partial<OnboardingState['lifestyle']>) => void;
  updatePrivacy: (data: Partial<OnboardingState['privacy']>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  basicInfo: {
    name: '',
    age: '',
    language: 'en',
  },
  healthProfile: {
    sex: '',
    menstrualStatus: '',
    cycleRegularity: '',
    cycleLength: '28',
    periodDuration: '5',
    reproductiveStatus: {
      tryingToConceive: false,
      pregnant: false,
      conditions: [],
    },
  },
  goals: {
    primary: '',
    secondary: [],
  },
  mentalHealth: {
    currentState: '',
    supportPreference: [],
  },
  lifestyle: {
    activityLevel: '',
    sleepPattern: '',
    averageSleep: '8',
  },
  privacy: {
    dataConsent: false,
    notifications: false,
    contact: '',
  },
  setStep: (step) => set({ step }),
  updateBasicInfo: (data) => set((state) => ({
    basicInfo: { ...state.basicInfo, ...data },
  })),
  updateHealthProfile: (data) => set((state) => ({
    healthProfile: { ...state.healthProfile, ...data },
  })),
  updateGoals: (data) => set((state) => ({
    goals: { ...state.goals, ...data },
  })),
  updateMentalHealth: (data) => set((state) => ({
    mentalHealth: { ...state.mentalHealth, ...data },
  })),
  updateLifestyle: (data) => set((state) => ({
    lifestyle: { ...state.lifestyle, ...data },
  })),
  updatePrivacy: (data) => set((state) => ({
    privacy: { ...state.privacy, ...data },
  })),
}));