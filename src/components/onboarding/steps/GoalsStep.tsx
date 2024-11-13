import { useOnboardingStore } from '../../../store/onboardingStore';

interface GoalsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const primaryGoals = [
  { id: 'period-tracking', label: 'Period Tracking', emoji: '📅' },
  { id: 'fertility-tracking', label: 'Fertility Tracking', emoji: '🌱' },
  { id: 'general-wellness', label: 'General Wellness', emoji: '🌟' },
  { id: 'mental-health', label: 'Mental Health Support', emoji: '🧠' },
];

const secondaryGoals = [
  { id: 'weight-management', label: 'Weight Management', emoji: '⚖️' },
  { id: 'stress-management', label: 'Stress Management', emoji: '🧘‍♀️' },
  { id: 'sleep-improvement', label: 'Better Sleep', emoji: '😴' },
  { id: 'nutrition', label: 'Nutrition', emoji: '🥗' },
  { id: 'exercise', label: 'Exercise', emoji: '🏃‍♀️' },
  { id: 'mindfulness', label: 'Mindfulness', emoji: '🌸' },
];

export default function GoalsStep({ onNext, onBack }: GoalsStepProps) {
  const { goals, updateGoals } = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleSecondaryGoal = (goalId: string) => {
    const newSecondaryGoals = goals.secondary.includes(goalId)
      ? goals.secondary.filter(g => g !== goalId)
      : [...goals.secondary, goalId];
    updateGoals({ secondary: newSecondaryGoals });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Health Goals 🎯</h2>
        <p className="mt-2 text-gray-600">Let's focus on what matters most to you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What's your primary health goal?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {primaryGoals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => updateGoals({ primary: goal.id })}
                className={`p-4 rounded-lg text-left transition-colors ${
                  goals.primary === goal.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                }`}
              >
                <span className="text-2xl mb-2">{goal.emoji}</span>
                <span className="block font-medium">{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Any other areas you'd like to focus on? (Optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {secondaryGoals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleSecondaryGoal(goal.id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  goals.secondary.includes(goal.id)
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                }`}
              >
                <span className="text-xl mr-2">{goal.emoji}</span>
                <span className="font-medium">{goal.label}</span>
              </button>
            ))}
          </div>
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