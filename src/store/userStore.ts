import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserProfile extends Record<string, any> {
  basicInfo: {
    name: string;
    age: string;
    language: string;
  };
  healthProfile: {
    sex: 'female' | 'non-binary' | '';
    menstrualStatus: 'menstruating' | 'not-menstruating' | 'pregnant' | 'postpartum';
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
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  startPregnancy: (lastPeriodDate: string) => Promise<void>;
  endPregnancy: (birthDate: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      setProfile: (profile) => set({ profile }),

      updateProfile: async (updates) => {
        try {
          set({ isLoading: true, error: null });
          const currentProfile = get().profile;
          
          if (!currentProfile) {
            throw new Error('No profile found');
          }

          // Deep merge the updates with current profile
          const updatedProfile = {
            ...currentProfile,
            ...updates,
            basicInfo: {
              ...currentProfile.basicInfo,
              ...(updates.basicInfo || {}),
            },
            healthProfile: {
              ...currentProfile.healthProfile,
              ...(updates.healthProfile || {}),
              reproductiveStatus: {
                ...currentProfile.healthProfile.reproductiveStatus,
                ...(updates.healthProfile?.reproductiveStatus || {}),
              },
            },
            goals: {
              ...currentProfile.goals,
              ...(updates.goals || {}),
            },
            mentalHealth: {
              ...currentProfile.mentalHealth,
              ...(updates.mentalHealth || {}),
            },
            lifestyle: {
              ...currentProfile.lifestyle,
              ...(updates.lifestyle || {}),
            },
          };

          // Save to Firestore
          const userRef = doc(db, 'users', 'current-user-id');
          await setDoc(userRef, updatedProfile, { merge: true });

          // Update local state
          set({ profile: updatedProfile, isLoading: false });
        } catch (error) {
          console.error('Error updating profile:', error);
          set({ error: 'Failed to update profile', isLoading: false });
          throw error;
        }
      },

      fetchProfile: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            set({ profile: userDoc.data() as UserProfile, isLoading: false });
          } else {
            set({ error: 'Profile not found', isLoading: false });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          set({ error: 'Failed to fetch profile', isLoading: false });
        }
      },

      startPregnancy: async (lastPeriodDate) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;

        await get().updateProfile({
          healthProfile: {
            menstrualStatus: 'pregnant',
            reproductiveStatus: {
              pregnant: true,
            },
          },
        });
      },

      endPregnancy: async (birthDate) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;

        await get().updateProfile({
          healthProfile: {
            menstrualStatus: 'postpartum',
            reproductiveStatus: {
              pregnant: false,
            },
          },
        });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);