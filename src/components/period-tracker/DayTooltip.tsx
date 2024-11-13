import { format } from 'date-fns';

interface DayTooltipProps {
  date: Date;
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

export default function DayTooltip({ date, status }: DayTooltipProps) {
  const { cycleDay, isPredictedPeriod, isOvulation, isFertile } = status;

  return (
    <div className="absolute z-10 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 transform -translate-x-1/2 left-1/2 mt-2">
      <div className="text-sm">
        <h4 className="font-semibold text-gray-900 mb-2">
          {format(date, 'MMMM d, yyyy')}
        </h4>

        {/* Status */}
        {cycleDay?.bleeding && (
          <div className="mb-2">
            <span className="font-medium text-red-600">Period Day</span>
            <span className="ml-2 text-gray-600 capitalize">({cycleDay.bleeding} flow)</span>
          </div>
        )}

        {isPredictedPeriod && (
          <div className="mb-2 text-red-600 font-medium">
            Predicted Period Start
          </div>
        )}

        {isOvulation && (
          <div className="mb-2 text-purple-600 font-medium">
            Ovulation Day
          </div>
        )}

        {isFertile && (
          <div className="mb-2 text-purple-600 font-medium">
            Fertile Window
          </div>
        )}

        {/* Symptoms */}
        {cycleDay?.symptoms && cycleDay.symptoms.length > 0 && (
          <div className="mb-2">
            <span className="font-medium text-gray-700">Symptoms:</span>
            <div className="text-gray-600 ml-2">
              {cycleDay.symptoms.map((symptom, index) => (
                <span key={symptom} className="capitalize">
                  {index > 0 ? ', ' : ''}{symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mood */}
        {cycleDay?.mood && cycleDay.mood.length > 0 && (
          <div className="mb-2">
            <span className="font-medium text-gray-700">Mood:</span>
            <div className="text-gray-600 ml-2">
              {cycleDay.mood.map((mood, index) => (
                <span key={mood} className="capitalize">
                  {index > 0 ? ', ' : ''}{mood}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Temperature */}
        {cycleDay?.temperature && (
          <div className="mb-2">
            <span className="font-medium text-gray-700">Temperature:</span>
            <span className="ml-2 text-gray-600">
              {cycleDay.temperature.value}°{cycleDay.temperature.unit}
            </span>
          </div>
        )}

        {/* Notes */}
        {cycleDay?.notes && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="font-medium text-gray-700">Notes:</span>
            <p className="text-gray-600 mt-1">{cycleDay.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}