import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { useUserStore } from '../../../store/userStore';

interface PrivacyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PrivacyStep({ onNext, onBack }: PrivacyStepProps) {
  const navigate = useNavigate();
  const { privacy, updatePrivacy } = useOnboardingStore();
  const { setProfile } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (privacy.dataConsent) {
      const onboardingData = useOnboardingStore.getState();
      // Convert onboarding data to user profile format
      const userProfile = {
        basicInfo: onboardingData.basicInfo,
        healthProfile: onboardingData.healthProfile,
        goals: onboardingData.goals,
        mentalHealth: onboardingData.mentalHealth,
        lifestyle: onboardingData.lifestyle,
      };
      
      // Set the user profile in the store
      setProfile(userProfile);
      
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Privacy & Preferences 🔒</h2>
        <p className="mt-2 text-gray-600">Your privacy is our priority</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={privacy.dataConsent}
                onChange={(e) => updatePrivacy({ dataConsent: e.target.checked })}
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                required
              />
              <span className="ml-2 block text-sm text-gray-700">
                I consent to the collection and processing of my health data to receive personalized insights and recommendations. 
                Your data is encrypted and never shared without your explicit permission.
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={privacy.notifications}
                onChange={(e) => updatePrivacy({ notifications: e.target.checked })}
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 block text-sm text-gray-700">
                I would like to receive notifications about health insights, period predictions, and wellness reminders.
              </span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Email (Optional)
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="contact"
              value={privacy.contact}
              onChange={(e) => updatePrivacy({ contact: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="For notifications and account recovery"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            We'll never share your email without your permission
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Your Rights</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Right to access your data</li>
            <li>• Right to modify or delete your data</li>
            <li>• Right to withdraw consent at any time</li>
            <li>• Right to data portability</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={!privacy.dataConsent}
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
}