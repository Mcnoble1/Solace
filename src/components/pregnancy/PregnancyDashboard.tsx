import { useEffect, useState } from 'react';
import { format, differenceInWeeks, parseISO } from 'date-fns';
import { usePregnancyStore } from '../../store/pregnancyStore';
import { useUserStore } from '../../store/userStore';
import { getPregnancyInsights } from '../../lib/gemini-pregnancy';
import SymptomTracker from './SymptomTracker';
import MeasurementLogger from './MeasurementLogger';
import AppointmentManager from './AppointmentManager';

export default function PregnancyDashboard() {
  const {
    lastPeriodDate,
    dueDate,
    symptoms,
    measurements,
    getCurrentTrimester,
    getWeekOfPregnancy,
    endPregnancy: endPregnancyTracking,
  } = usePregnancyStore();
  const { profile, updateProfile } = useUserStore();

  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekNumber = getWeekOfPregnancy() || 0;
  const trimester = getCurrentTrimester();

  useEffect(() => {
    fetchInsights();
  }, [weekNumber, symptoms.length, measurements.length]);

  const fetchInsights = async () => {
    if (!weekNumber) return;
    
    setIsLoading(true);
    try {
      const recentSymptoms = symptoms.slice(-5);
      const recentMeasurements = measurements.slice(-5);
      const data = await getPregnancyInsights(weekNumber, recentSymptoms, recentMeasurements);
      setInsights(data);
    } catch (error) {
      console.error('Error fetching pregnancy insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndPregnancy = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Update user profile
      await updateProfile({
        healthProfile: {
          ...profile?.healthProfile,
          menstrualStatus: 'menstruating',
          reproductiveStatus: {
            ...profile?.healthProfile.reproductiveStatus,
            pregnant: false,
          },
        },
      });
      
      // End pregnancy tracking
      await endPregnancyTracking(today);
      
      // Close modal and reset state
      setShowEndModal(false);
      window.location.href = '/period-tracker'; // Force navigation to period tracker
    } catch (error) {
      console.error('Error ending pregnancy mode:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lastPeriodDate || !dueDate) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* End Pregnancy Mode Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              End Pregnancy Tracking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to switch back to period tracking? This will end pregnancy tracking mode.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEndPregnancy}
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Switching...' : 'Switch to Period Tracking'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pregnancy Tracker</h1>
        <button
          onClick={() => setShowEndModal(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Switch to Period Tracking
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600">Week of Pregnancy</p>
          <p className="text-2xl font-bold text-purple-900">{weekNumber}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600">Trimester</p>
          <p className="text-2xl font-bold text-blue-900">{trimester}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4">
          <p className="text-sm text-pink-600">Due Date</p>
          <p className="text-2xl font-bold text-pink-900">{format(parseISO(dueDate), 'MMM d, yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Track Your Journey</h2>
            <div className="space-y-6">
              <SymptomTracker />
              <MeasurementLogger />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Appointments</h2>
            <AppointmentManager />
          </div>
        </div>

        {/* Right Column - Insights */}
        {insights && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Insights</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900">Baby's Development</h3>
                <ul className="mt-2 space-y-2">
                  {insights.development.map((point: string, index: number) => (
                    <li key={index} className="text-gray-600">• {point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Common Symptoms</h3>
                <ul className="mt-2 space-y-2">
                  {insights.commonSymptoms.map((symptom: string, index: number) => (
                    <li key={index} className="text-gray-600">• {symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Recommendations</h3>
                {Object.entries(insights.recommendations).map(([category, items]) => (
                  <div key={category} className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 capitalize">{category}</h4>
                    <ul className="mt-1 space-y-1">
                      {(items as string[]).map((item, index) => (
                        <li key={index} className="text-gray-600 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {insights.warningSignsToWatch.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-medium text-red-800">Warning Signs to Watch</h3>
                  <ul className="mt-2 space-y-2">
                    {insights.warningSignsToWatch.map((sign: string, index: number) => (
                      <li key={index} className="text-red-700">• {sign}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}