import { useState } from 'react';
import { useOnboardingStore } from '../../../store/onboardingStore';

interface BasicInfoStepProps {
  onNext: () => void;
}

export default function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const { basicInfo, updateBasicInfo } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (basicInfo.age && (isNaN(Number(basicInfo.age)) || Number(basicInfo.age) < 13)) {
      newErrors.age = 'Please enter a valid age (13 or older)';
    }

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to Solace 👋</h2>
        <p className="mt-2 text-gray-600">Let's get to know you better to personalize your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name or Nickname (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={basicInfo.name}
            onChange={(e) => updateBasicInfo({ name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="How should we call you?"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            value={basicInfo.age}
            onChange={(e) => updateBasicInfo({ age: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            min="13"
            required
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Preferred Language
          </label>
          <select
            id="language"
            value={basicInfo.language}
            onChange={(e) => updateBasicInfo({ language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            {/* Add more languages as needed */}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Continue
        </button>
      </form>
    </div>
  );
}