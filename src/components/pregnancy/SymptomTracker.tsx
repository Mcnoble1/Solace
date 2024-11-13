import { useState } from 'react';
import { usePregnancyStore } from '../../store/pregnancyStore';

const commonSymptoms = [
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'backPain', label: 'Back Pain', emoji: '🤷' },
  { id: 'swelling', label: 'Swelling', emoji: '🦶' },
  { id: 'heartburn', label: 'Heartburn', emoji: '🔥' },
];

export default function SymptomTracker() {
  const { addSymptom } = usePregnancyStore();
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymptom) return;

    addSymptom({
      date: new Date().toISOString().split('T')[0],
      type: selectedSymptom,
      severity,
      notes,
    });

    // Reset form
    setSelectedSymptom('');
    setSeverity('mild');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Symptom
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonSymptoms.map((symptom) => (
            <button
              key={symptom.id}
              type="button"
              onClick={() => setSelectedSymptom(symptom.id)}
              className={`p-2 rounded-md text-left ${
                selectedSymptom === symptom.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="mr-2">{symptom.emoji}</span>
              {symptom.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Severity
        </label>
        <div className="flex space-x-4">
          {['mild', 'moderate', 'severe'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(level as 'mild' | 'moderate' | 'severe')}
              className={`px-4 py-2 rounded-md ${
                severity === level
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Add any additional details..."
        />
      </div>

      <button
        type="submit"
        disabled={!selectedSymptom}
        className="w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Log Symptom
      </button>
    </form>
  );
}