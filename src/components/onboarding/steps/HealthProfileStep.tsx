import { useState } from 'react';
import { useOnboardingStore } from '../../../store/onboardingStore';

interface HealthProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

const conditions = [
  'PCOS',
  'Endometriosis',
  'Menopause',
  'Irregular Periods',
  'Thyroid Issues',
  'Other',
];

export default function HealthProfileStep({ onNext, onBack }: HealthProfileStepProps) {
  const { healthProfile, updateHealthProfile } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!healthProfile.sex) {
      newErrors.sex = 'Please select your sex';
    }

    if (!healthProfile.menstrualStatus) {
      newErrors.menstrualStatus = 'Please select your menstrual status';
    }

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  const toggleCondition = (condition: string) => {
    const currentConditions = healthProfile.reproductiveStatus.conditions;
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition];
    
    updateHealthProfile({
      reproductiveStatus: {
        ...healthProfile.reproductiveStatus,
        conditions: newConditions,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Health Profile 💜</h2>
        <p className="mt-2 text-gray-600">Help us understand your health better</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sex</label>
          <div className="mt-2 space-x-4">
            {['female', 'non-binary'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateHealthProfile({ sex: option as 'female' | 'non-binary' })}
                className={`px-4 py-2 rounded-md ${
                  healthProfile.sex === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {errors.sex && <p className="mt-1 text-sm text-red-600">{errors.sex}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Menstrual Status</label>
          <div className="mt-2 space-x-4">
            {[
              { value: 'menstruating', label: 'Menstruating' },
              { value: 'not-menstruating', label: 'Not Menstruating' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateHealthProfile({ menstrualStatus: option.value as 'menstruating' | 'not-menstruating' })}
                className={`px-4 py-2 rounded-md ${
                  healthProfile.menstrualStatus === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.menstrualStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.menstrualStatus}</p>
          )}
        </div>

        {healthProfile.menstrualStatus === 'menstruating' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cycle Regularity</label>
              <div className="mt-2 space-x-4">
                {[
                  { value: 'regular', label: 'Regular' },
                  { value: 'irregular', label: 'Irregular' },
                  { value: 'unknown', label: 'Not Sure' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateHealthProfile({ cycleRegularity: option.value as 'regular' | 'irregular' | 'unknown' })}
                    className={`px-4 py-2 rounded-md ${
                      healthProfile.cycleRegularity === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cycleLength" className="block text-sm font-medium text-gray-700">
                  Average Cycle Length (days)
                </label>
                <input
                  type="number"
                  id="cycleLength"
                  value={healthProfile.cycleLength}
                  onChange={(e) => updateHealthProfile({ cycleLength: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  min="21"
                  max="35"
                />
              </div>

              <div>
                <label htmlFor="periodDuration" className="block text-sm font-medium text-gray-700">
                  Average Period Duration (days)
                </label>
                <input
                  type="number"
                  id="periodDuration"
                  value={healthProfile.periodDuration}
                  onChange={(e) => updateHealthProfile({ periodDuration: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reproductive Status
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={healthProfile.reproductiveStatus.tryingToConceive}
                onChange={(e) =>
                  updateHealthProfile({
                    reproductiveStatus: {
                      ...healthProfile.reproductiveStatus,
                      tryingToConceive: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2">Trying to Conceive</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={healthProfile.reproductiveStatus.pregnant}
                onChange={(e) =>
                  updateHealthProfile({
                    reproductiveStatus: {
                      ...healthProfile.reproductiveStatus,
                      pregnant: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2">Pregnant</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Conditions (if any)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {conditions.map((condition) => (
              <label key={condition} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={healthProfile.reproductiveStatus.conditions.includes(condition)}
                  onChange={() => toggleCondition(condition)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2">{condition}</span>
              </label>
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