import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';

interface CycleDay {
  date: string;
  bleeding?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  mood?: string[];
  temperature?: {
    value: number;
    unit: 'F' | 'C';
  };
  notes?: string;
  cervicalMucus?: 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg-white';
}

interface Cycle {
  startDate: string;
  endDate?: string;
  length?: number;
  periodLength?: number;
  days: CycleDay[];
}

interface PeriodState {
  cycles: Cycle[];
  settings: {
    averageCycleLength: number;
    averagePeriodLength: number;
    trackTemperature: boolean;
    temperatureUnit: 'F' | 'C';
    trackCervicalMucus: boolean;
    notifications: {
      periodReminder: boolean;
      ovulationReminder: boolean;
      symptomReminder: boolean;
    };
    pregnancyMode: boolean;
  };
  predictions: {
    nextPeriod?: string;
    ovulation?: string;
    fertileWindow?: { start: string; end: string };
  };
  addCycle: (cycle: Cycle) => void;
  updateCycleDay: (date: string, data: Partial<CycleDay>) => void;
  updateSettings: (settings: Partial<PeriodState['settings']>) => void;
  calculatePredictions: () => void;
}

export const usePeriodStore = create<PeriodState>()(
  persist(
    (set, get) => ({
      cycles: [],
      settings: {
        averageCycleLength: 28,
        averagePeriodLength: 5,
        trackTemperature: false,
        temperatureUnit: 'F',
        trackCervicalMucus: false,
        notifications: {
          periodReminder: true,
          ovulationReminder: false,
          symptomReminder: false,
        },
        pregnancyMode: false,
      },
      predictions: {},

      addCycle: (cycle) => set((state) => ({
        cycles: [...state.cycles, cycle],
      })),

      updateCycleDay: (date, data) => set((state) => {
        const cycles = state.cycles.map(cycle => {
          if (date >= cycle.startDate && (!cycle.endDate || date <= cycle.endDate)) {
            const dayIndex = cycle.days.findIndex(day => day.date === date);
            const days = [...cycle.days];
            
            if (dayIndex >= 0) {
              days[dayIndex] = { ...days[dayIndex], ...data };
            } else {
              days.push({ date, ...data });
            }
            
            return { ...cycle, days };
          }
          return cycle;
        });

        return { cycles };
      }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      calculatePredictions: () => {
        const state = get();
        const lastCycle = state.cycles[state.cycles.length - 1];
        
        if (!lastCycle) return;

        const nextPeriodDate = addDays(
          parseISO(lastCycle.startDate),
          state.settings.averageCycleLength
        );

        const ovulationDate = addDays(
          parseISO(lastCycle.startDate),
          state.settings.averageCycleLength - 14
        );

        const fertileWindowStart = addDays(ovulationDate, -5);
        const fertileWindowEnd = addDays(ovulationDate, 1);

        set({
          predictions: {
            nextPeriod: format(nextPeriodDate, 'yyyy-MM-dd'),
            ovulation: format(ovulationDate, 'yyyy-MM-dd'),
            fertileWindow: {
              start: format(fertileWindowStart, 'yyyy-MM-dd'),
              end: format(fertileWindowEnd, 'yyyy-MM-dd'),
            },
          },
        });
      },
    }),
    {
      name: 'period-storage',
    }
  )
);