import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import BasicInfoStep from './steps/BasicInfoStep';
import HealthProfileStep from './steps/HealthProfileStep';
import GoalsStep from './steps/GoalsStep';
import MentalHealthStep from './steps/MentalHealthStep';
import LifestyleStep from './steps/LifestyleStep';
import PrivacyStep from './steps/PrivacyStep';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { step, setStep } = useOnboardingStore();

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep onNext={handleNext} />;
      case 2:
        return <HealthProfileStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <GoalsStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <MentalHealthStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <LifestyleStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <PrivacyStep onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 mx-1 rounded-full ${
                index + 1 <= step ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Step {step} of 6
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStep()}
      </div>
    </div>
  );
}