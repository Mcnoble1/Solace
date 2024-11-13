import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { getDailyHealthTip, getDailyFact } from '../lib/gemini-health';
import HealthAssistant from '../components/health-assistant/HealthAssistant';
import DailyTip from '../components/health-assistant/DailyTip';
import DailyFact from '../components/health-assistant/DailyFact';

export default function Dashboard() {
  const { profile } = useUserStore();
  const [dailyTip, setDailyTip] = useState<any>(null);
  const [dailyFact, setDailyFact] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchDailyContent();
    }
  }, [profile]);

  const fetchDailyContent = async () => {
    setIsLoading(true);
    try {
      const [tipResponse, factResponse] = await Promise.all([
        getDailyHealthTip(profile),
        getDailyFact()
      ]);
      setDailyTip(tipResponse);
      setDailyFact(factResponse);
    } catch (error) {
      console.error('Error fetching daily content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile.basicInfo.name || 'Friend'} 👋
        </h1>
        <p className="mt-2 text-gray-600">Here's your personalized health dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/period-tracker"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2">📅</span>
              <h3 className="text-lg font-semibold">Period Tracker</h3>
              <p className="text-gray-600">Track your cycle and get predictions</p>
            </Link>
            <Link
              to="/symptom-checker"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2">🩺</span>
              <h3 className="text-lg font-semibold">Symptom Checker</h3>
              <p className="text-gray-600">Get AI-powered health insights</p>
            </Link>
          </div>

          {/* Daily Content */}
          <div className="space-y-6">
            {dailyTip && <DailyTip tip={dailyTip} />}
            {dailyFact && <DailyFact fact={dailyFact} />}
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Health Assistant */}
          <HealthAssistant />

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link
                to="/mental-health"
                className="block text-purple-600 hover:text-purple-800"
              >
                Mental Health Support →
              </Link>
              <Link
                to="/resources"
                className="block text-purple-600 hover:text-purple-800"
              >
                Health Resources →
              </Link>
              <Link
                to="/profile"
                className="block text-purple-600 hover:text-purple-800"
              >
                Update Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}