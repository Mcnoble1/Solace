import { useState } from 'react';

const moods = [
  { id: 'great', emoji: '😊', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState('');

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    // TODO: Save mood to user's history
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">How are you feeling?</h2>

      <div className="grid grid-cols-3 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`p-4 rounded-lg text-center transition-colors ${
              selectedMood === mood.id
                ? 'bg-purple-100 border-2 border-purple-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <span className="text-3xl mb-2 block">{mood.emoji}</span>
            <span className="block text-sm font-medium text-gray-700">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}