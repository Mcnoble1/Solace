import { format } from 'date-fns';
import { useState } from 'react';
import DayTooltip from './DayTooltip';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  status: {
    cycleDay: {
      bleeding?: 'light' | 'medium' | 'heavy';
      symptoms?: string[];
      mood?: string[];
      temperature?: {
        value: number;
        unit: 'F' | 'C';
      };
      notes?: string;
    } | null;
    isPredictedPeriod: boolean;
    isOvulation: boolean;
    isFertile: boolean;
  };
}

export default function DayCell({ date, isCurrentMonth, status }: DayCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { cycleDay, isPredictedPeriod, isOvulation, isFertile } = status;

  let backgroundColor = 'bg-white';
  let textColor = isCurrentMonth ? 'text-gray-900' : 'text-gray-400';
  let dotColor = '';
  let borderColor = '';

  // Determine colors based on status
  if (cycleDay?.bleeding) {
    backgroundColor = {
      light: 'bg-red-100',
      medium: 'bg-red-200',
      heavy: 'bg-red-300',
    }[cycleDay.bleeding];
    dotColor = 'bg-red-500';
  } else if (isPredictedPeriod) {
    backgroundColor = 'bg-red-50';
    dotColor = 'bg-red-300';
  } else if (isOvulation) {
    backgroundColor = 'bg-purple-100';
    dotColor = 'bg-purple-500';
  } else if (isFertile) {
    backgroundColor = 'bg-purple-50';
    dotColor = 'bg-purple-300';
  }

  // Add indicators for symptoms and moods
  if (cycleDay?.symptoms?.length) {
    borderColor = 'border-2 border-yellow-300';
  }
  if (cycleDay?.mood?.length) {
    if (!borderColor) borderColor = 'border-2 border-blue-300';
  }

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          aspect-square p-2 
          ${backgroundColor} 
          ${borderColor}
          rounded-lg transition-colors 
          hover:bg-opacity-75 
          cursor-pointer
        `}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className={`text-sm font-medium ${textColor}`}>
            {date.getDate()}
          </span>
          {dotColor && (
            <div className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-1`} />
          )}
        </div>
      </div>

      {showTooltip && (cycleDay || isPredictedPeriod || isOvulation || isFertile) && (
        <DayTooltip
          date={date}
          status={status}
        />
      )}
    </div>
  );
}