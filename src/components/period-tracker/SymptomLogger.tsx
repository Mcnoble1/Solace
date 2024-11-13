import { useState } from 'react';
import { format } from 'date-fns';
import { usePeriodStore } from '../../store/periodStore';

const symptoms = [
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'bloating', label: 'Bloating', emoji: '😫' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'acne', label: 'Acne', emoji: '😔' },
  { id: 'cravings', label: 'Cravings', emoji: '🍫' },
];

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'irritable', label: 'Irritable', emoji: '😠' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
];

function convertTemperature(value: number, fromUnit: 'F' | 'C', toUnit: 'F' | 'C'): number {
  if (fromUnit === toUnit) return value;
  return fromUnit === 'F'
    ? (value - 32) * 5/9  // F to C
    : (value * 9/5) + 32; // C to F
}

export default function SymptomLogger() {
  const [selectedDate] = useState(new Date());
  const { updateCycleDay, addCycle, settings, updateSettings } = usePeriodStore();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState('');
  const [bleeding, setBleeding] = useState<'light' | 'medium' | 'heavy' | ''>('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const tempData = temperature ? {
      value: parseFloat(temperature),
      unit: settings.temperatureUnit
    } : undefined;
    
    // If bleeding is logged, this might be the start of a new cycle
    if (bleeding) {
      addCycle({
        startDate: dateStr,
        days: [{
          date: dateStr,
          bleeding,
          symptoms: selectedSymptoms,
          mood: selectedMoods,
          notes,
          temperature: tempData,
        }]
      });
    } else {
      // Otherwise, just update the day in the current cycle
      updateCycleDay(dateStr, {
        symptoms: selectedSymptoms,
        mood: selectedMoods,
        notes,
        temperature: tempData,
        bleeding: bleeding || undefined,
      });
    }

    // Show success message
    setSuccessMessage('Entry saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);

    // Reset form
    setSelectedSymptoms([]);
    setSelectedMoods([]);
    setNotes('');
    setTemperature('');
    setBleeding('');
  };

  const toggleTemperatureUnit = () => {
    if (temperature) {
      const currentTemp = parseFloat(temperature);
      const newUnit = settings.temperatureUnit === 'F' ? 'C' : 'F';
      const convertedTemp = convertTemperature(currentTemp, settings.temperatureUnit, newUnit);
      setTemperature(convertedTemp.toFixed(1));
    }
    updateSettings({ temperatureUnit: settings.temperatureUnit === 'F' ? 'C' : 'F' });
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev =>
      prev.includes(moodId)
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Log for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bleeding
            </label>
            <div className="flex space-x-4">
              {['light', 'medium', 'heavy'].map((flow) => (
                <button
                  key={flow}
                  type="button"
                  onClick={() => setBleeding(flow as 'light' | 'medium' | 'heavy')}
                  className={`px-4 py-2 rounded-md ${
                    bleeding === flow
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {flow.charAt(0).toUpperCase() + flow.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms
            </label>
            <div className="grid grid-cols-3 gap-2">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-2 rounded-md text-left ${
                    selectedSymptoms.includes(symptom.id)
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
              Mood
            </label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => toggleMood(mood.id)}
                  className={`p-2 rounded-md text-left ${
                    selectedMoods.includes(mood.id)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                Temperature
              </label>
              <button
                type="button"
                onClick={toggleTemperatureUnit}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Switch to °{settings.temperatureUnit === 'F' ? 'C' : 'F'}
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                id="temperature"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pr-8"
                placeholder={settings.temperatureUnit === 'F' ? "98.6" : "37.0"}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                °{settings.temperatureUnit}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Save Entry
      </button>
    </form>
  );
}