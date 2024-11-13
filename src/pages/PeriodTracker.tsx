import { useState, useEffect } from 'react';
import Calendar from '../components/period-tracker/Calendar';
import SymptomLogger from '../components/period-tracker/SymptomLogger';
import PregnancyDashboard from '../components/pregnancy/PregnancyDashboard';
import { usePeriodStore } from '../store/periodStore';
import { usePregnancyStore } from '../store/pregnancyStore';
import { useUserStore } from '../store/userStore';
import { analyzeCycleData, getPhaseInsights } from '../lib/gemini-period';

export default function PeriodTracker() {
  const { profile, startPregnancy: updateUserPregnancy } = useUserStore();
  const { cycles, predictions, calculatePredictions } = usePeriodStore();
  const { isPregnant, startPregnancy: startPregnancyTracking } = usePregnancyStore();
  const [insights, setInsights] = useState<any>(null);
  const [phaseInfo, setPhaseInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPregnancyPrompt, setShowPregnancyPrompt] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState('');

  useEffect(() => {
    if (!isPregnant) {
      calculatePredictions();
      fetchInsights();
    }
  }, [cycles, isPregnant]);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const [cycleInsights, currentPhase] = await Promise.all([
        analyzeCycleData(cycles),
        getPhaseInsights('menstrual', { cycles, predictions })
      ]);
      
      setInsights(cycleInsights);
      setPhaseInfo(currentPhase);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPregnancy = async () => {
    if (!lastPeriodDate) return;
    
    try {
      // Update user profile first
      await updateUserPregnancy(lastPeriodDate);
      
      // Start pregnancy tracking
      startPregnancyTracking(lastPeriodDate);
      
      // Close the modal
      setShowPregnancyPrompt(false);
    } catch (error) {
      console.error('Error starting pregnancy mode:', error);
    }
  };

  if (isPregnant || profile?.healthProfile.menstrualStatus === 'pregnant') {
    return <PregnancyDashboard />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Pregnancy Mode Prompt */}
      {showPregnancyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Start Pregnancy Tracking
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Day of Last Period
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPregnancyPrompt(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartPregnancy}
                  disabled={!lastPeriodDate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Start Pregnancy Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Period Tracker</h1>
        <button
          onClick={() => setShowPregnancyPrompt(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Switch to Pregnancy Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Period Calendar</h2>
            <Calendar />
          </div>

          {insights && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cycle Insights</h2>
              <div className="space-y-4">
                <p className="text-gray-600">{insights.summary}</p>
                {insights.insights.cycleHealth.map((insight: string, index: number) => (
                  <p key={index} className="text-gray-600">{insight}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {phaseInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Current Phase: {phaseInfo.phase}
              </h3>
              <p className="text-gray-600 mb-4">{phaseInfo.description}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Recommendations</h4>
                  <ul className="mt-2 space-y-1">
                    {phaseInfo.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Today</h2>
            <SymptomLogger />
          </div>
        </div>
      </div>
    </div>
  );
}