import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePeriodStore } from '../../store/periodStore';
import DayCell from './DayCell';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { cycles, predictions } = usePeriodStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Find cycle and day data
    const cycleDay = cycles.reduce((found: any, cycle) => {
      const day = cycle.days.find(d => d.date === dateStr);
      return day || found;
    }, null);

    // Check predictions
    const isPredictedPeriod = predictions.nextPeriod && 
      isSameDay(date, parseISO(predictions.nextPeriod));
    const isOvulation = predictions.ovulation && 
      isSameDay(date, parseISO(predictions.ovulation));
    const isFertile = predictions.fertileWindow && 
      date >= parseISO(predictions.fertileWindow.start) && 
      date <= parseISO(predictions.fertileWindow.end);

    return {
      cycleDay,
      isPredictedPeriod,
      isOvulation,
      isFertile,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {monthDays.map(day => (
          <DayCell
            key={format(day, 'yyyy-MM-dd')}
            date={day}
            isCurrentMonth={isSameMonth(day, currentDate)}
            status={getDayStatus(day)}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
          <span>Ovulation</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-200 mr-2"></div>
          <span>Predicted Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-200 mr-2"></div>
          <span>Fertile Window</span>
        </div>
      </div>
    </div>
  );
}