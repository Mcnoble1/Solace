import { useOnboardingStore } from '../../../store/onboardingStore';

interface LifestyleStepProps {
  onNext: () => void;
  onBack: () => void;
}

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', emoji: '💺', description: 'Mostly sitting throughout the day' },
  { id: 'moderate', label: 'Moderate', emoji: '🚶‍♀️', description: 'Regular light activity' },
  { id: 'active', label: 'Active', emoji: '🏃‍♀️', description: 'Regular exercise or physical work' },
];

const sleepPatterns = [
  { id: 'regular', label: 'Regular', emoji: '😴', description: 'Consistent sleep schedule' },
  { id: 'irregular', label: 'Irregular', emoji: '🌙', description: 'Varying sleep schedule' },
];

export default function LifestyleStep({ onNext, onBack }: LifestyleStepProps) {
  const { lifestyle, updateLifestyle } = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Lifestyle Habits 🌿</h2>
        <p className="mt-2 text-gray-600">Help us understand your daily routine</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What's your typical activity level?
          </label>
          <div className="grid grid-cols-1 gap-4">
            {activityLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => updateLifestyle({ activityLevel: level.id as 'sedentary' | 'moderate' | 'active' })}
                className={`p-4 rounded-lg text-left transition-colors ${
                  lifestyle.activityLevel === level.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{level.emoji}</span>
                  <div>
                    <span className="block font-medium">{level.label}</span>
                    <span className="text-sm text-gray-500">{level.description}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How would you describe your sleep pattern?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {sleepPatterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                onClick={() => updateLifestyle({ sleepPattern: pattern.id as 'regular' | 'irregular' })}
                className={`p-4 rounded-lg text-center transition-colors ${
                  lifestyle.sleepPattern === pattern.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                }`}
              >
                <span className="text-2xl block mb-2">{pattern.emoji}</span>
                <span className="block font-medium">{pattern.label}</span>
                <span className="text-sm text-gray-500">{pattern.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="averageSleep" className="block text-sm font-medium text-gray-700">
            Average hours of sleep per night
          </label>
          <input
            type="number"
            id="averageSleep"
            value={lifestyle.averageSleep}
            onChange={(e) => updateLifestyle({ averageSleep: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            min="4"
            max="12"
            step="0.5"
          />
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
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}