import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addWeeks, differenceInWeeks, format, parseISO } from 'date-fns';

interface Symptom {
  date: string;
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface Measurement {
  date: string;
  weight?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  notes?: string;
}

interface PregnancyState {
  isPregnant: boolean;
  isPostpartum: boolean;
  dueDate?: string;
  lastPeriodDate?: string;
  birthDate?: string;
  symptoms: Symptom[];
  measurements: Measurement[];
  appointments: {
    date: string;
    title: string;
    notes?: string;
    completed: boolean;
  }[];
  settings: {
    weightUnit: 'kg' | 'lbs';
    notifications: {
      appointments: boolean;
      weeklyUpdates: boolean;
      measurements: boolean;
    };
  };
  milestones: {
    date: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  postpartum: {
    recoveryStart?: string;
    firstPeriodReturn?: string;
    symptoms: Symptom[];
    notes: {
      date: string;
      content: string;
    }[];
  };
  startPregnancy: (lastPeriodDate: string) => void;
  endPregnancy: (birthDate: string) => void;
  startPostpartum: (birthDate: string) => void;
  addSymptom: (symptom: Symptom) => void;
  addMeasurement: (measurement: Measurement) => void;
  addAppointment: (appointment: Omit<PregnancyState['appointments'][0], 'completed'>) => void;
  updateSettings: (settings: Partial<PregnancyState['settings']>) => void;
  getCurrentTrimester: () => 1 | 2 | 3 | null;
  getWeekOfPregnancy: () => number | null;
}

export const usePregnancyStore = create<PregnancyState>()(
  persist(
    (set, get) => ({
      isPregnant: false,
      isPostpartum: false,
      symptoms: [],
      measurements: [],
      appointments: [],
      settings: {
        weightUnit: 'kg',
        notifications: {
          appointments: true,
          weeklyUpdates: true,
          measurements: true,
        },
      },
      milestones: [],
      postpartum: {
        symptoms: [],
        notes: [],
      },

      startPregnancy: (lastPeriodDate) => {
        const dueDate = format(addWeeks(parseISO(lastPeriodDate), 40), 'yyyy-MM-dd');
        set({
          isPregnant: true,
          lastPeriodDate,
          dueDate,
          symptoms: [],
          measurements: [],
          appointments: [],
        });
      },

      endPregnancy: (birthDate) => {
        set((state) => ({
          isPregnant: false,
          birthDate,
          postpartum: {
            ...state.postpartum,
            recoveryStart: birthDate,
          },
        }));
      },

      startPostpartum: (birthDate) => {
        set({
          isPostpartum: true,
          birthDate,
          postpartum: {
            recoveryStart: birthDate,
            symptoms: [],
            notes: [],
          },
        });
      },

      addSymptom: (symptom) => set((state) => ({
        symptoms: [...state.symptoms, symptom],
      })),

      addMeasurement: (measurement) => set((state) => ({
        measurements: [...state.measurements, measurement],
      })),

      addAppointment: (appointment) => set((state) => ({
        appointments: [...state.appointments, { ...appointment, completed: false }],
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      getCurrentTrimester: () => {
        const state = get();
        if (!state.lastPeriodDate) return null;

        const weeks = differenceInWeeks(new Date(), parseISO(state.lastPeriodDate));
        if (weeks <= 13) return 1;
        if (weeks <= 26) return 2;
        return 3;
      },

      getWeekOfPregnancy: () => {
        const state = get();
        if (!state.lastPeriodDate) return null;

        return differenceInWeeks(new Date(), parseISO(state.lastPeriodDate));
      },
    }),
    {
      name: 'pregnancy-storage',
    }
  )
);