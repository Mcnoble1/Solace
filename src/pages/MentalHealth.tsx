import { useState } from 'react';
import { getMentalHealthSupport } from '../lib/gemini-health';
import MentalHealthSupport from '../components/mental-health/MentalHealthSupport';
import MoodTracker from '../components/mental-health/MoodTracker';
import JournalEntry from '../components/mental-health/JournalEntry';

export default function MentalHealth() {
  const [isLoading, setIsLoading] = useState(false);
  const [supportResponse, setSupportResponse] = useState<any>(null);

  const handleSupportRequest = async (input: string) => {
    setIsLoading(true);
    try {
      const response = await getMentalHealthSupport(input);
      setSupportResponse(response);
    } catch (error) {
      console.error('Error getting mental health support:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mental Health Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <MoodTracker />
          <div className="mt-8">
            <JournalEntry />
          </div>
        </div>

        <div>
          <MentalHealthSupport
            onSupportRequest={handleSupportRequest}
            response={supportResponse}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="mt-8 bg-purple-50 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Crisis Support</h2>
        <p className="text-gray-700">
          If you're in crisis, help is available 24/7:
          <br />
          National Crisis Hotline: <strong>988</strong>
        </p>
      </div>
    </div>
  );
}