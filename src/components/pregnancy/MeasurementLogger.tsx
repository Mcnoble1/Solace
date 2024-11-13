import { useState } from 'react';
import { usePregnancyStore } from '../../store/pregnancyStore';

export default function MeasurementLogger() {
  const { addMeasurement, settings } = usePregnancyStore();
  const [weight, setWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMeasurement({
      date: new Date().toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : undefined,
      bloodPressure: systolic && diastolic ? {
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
      } : undefined,
      notes,
    });

    // Reset form
    setWeight('');
    setSystolic('');
    setDiastolic('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight ({settings.weightUnit})
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder={settings.weightUnit === 'kg' ? "65.5" : "145.5"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="systolic" className="block text-sm font-medium text-gray-700">
            Systolic (mmHg)
          </label>
          <input
            type="number"
            id="systolic"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="120"
          />
        </div>
        <div>
          <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700">
            Diastolic (mmHg)
          </label>
          <input
            type="number"
            id="diastolic"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="80"
          />
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
          placeholder="Add any additional notes..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Log Measurements
      </button>
    </form>
  );
}