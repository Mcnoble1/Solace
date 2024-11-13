import { useOnboardingStore } from '../../../store/onboardingStore';

interface MentalHealthStepProps {
  onNext: () => void;
  onBack: () => void;
}

const mentalStates = [
  { id: 'great', label: 'Great', emoji: '😊' },
  { id: 'good', label: 'Good', emoji: '🙂' },
  { id: 'okay', label: 'Okay', emoji: '😐' },
  { id: 'stressed', label: 'Stressed', emoji: '😰' },
  { id: 'anxious', label: 'Anxious', emoji: '😨' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
];

const supportPreferences = [
  { id: 'chat', label: 'Chat Support', emoji: '💬' },
  { id: 'breathing', label: 'Breathing Exercises', emoji: '🫁' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘‍♀️' },
  { id: 'journaling', label: 'Journaling', emoji: '📔' },
  { id: 'therapy', label: 'Professional Support', emoji: '👩‍⚕️' },
  { id: 'community', label: 'Community Support', emoji: '👥' },
];

export default function MentalHealthStep({ onNext, onBack }: MentalHealthStepProps) {
  const { mentalHealth, updateMentalHealth } = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleSupportPreference = (prefId: string) => {
    const newPreferences = mentalHealth.supportPreference.includes(prefId)
      ? mentalHealth.supportPreference.filter(p => p !== prefId)
      : [...mentalHealth.supportPreference, prefId];
    updateMentalHealth({ supportPreference: newPreferences });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Mental Wellbeing 🌸</h2>
        <p className="mt-2 text-gray-600">Your mental health matters to us</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How are you feeling lately?
          </label>
          <div className="grid grid-cols-3 gap-4">
            {mentalStates.map((state) => (
              <button
                key={state.id}
                type="button"
                onClick={() => updateMentalHealth({ currentState: state.id })}
                className={`p-4 rounded-lg text-center transition-colors ${
                  mentalHealth.currentState === state.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                }`}
              >
                <span className="text-3xl block mb-2">{state.emoji}</span>
                <span className="block font-medium">{state.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What kind of mental health support interests you? (Optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {supportPreferences.map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => toggleSupportPreference(pref.id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  mentalHealth.supportPreference.includes(pref.id)
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                }`}
              >
                <span className="text-xl mr-2">{pref.emoji}</span>
                <span className="font-medium">{pref.label}</span>
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