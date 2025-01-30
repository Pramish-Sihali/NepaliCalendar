// components/calendar/DayCell.tsx
import React from 'react';
import { CalendarData , CalendarEvent } from './types';
// import { CalendarEvent } from '@/types';

interface DayCellProps {
  day: CalendarData;
  dayOfWeek: number;
  isSelected: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  onClick: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  dayOfWeek,
  isSelected,
  isToday,
  events,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        aspect-square p-1 rounded-lg
        hover:bg-gray-50 transition-colors duration-200
        relative group
        ${isSelected ? 'bg-blue-50 border-2 border-blue-300' : 'border border-gray-100'}
        ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className={`
          text-lg font-semibold
          ${dayOfWeek === 0 ? 'text-gray-600' : ''}
          ${dayOfWeek === 6 ? 'text-red-600' : 'text-gray-800'}
          ${isSelected ? 'text-blue-700' : ''}
        `}>
          {day.nepali_date}
        </span>
        <span className="text-xs text-gray-500">
          {day.english_date}
        </span>

        {/* Event indicators */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`w-1.5 h-1.5 rounded-full ${event.color}`}
              title={event.title}
            />
          ))}
        </div>

        {/* Special day indicators */}
        <div className="absolute top-0.5 right-0.5 flex gap-0.5">
          {day.holiday && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Holiday"/>
          )}
          {/* {day.marriage_date && (
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Marriage Date"/>
          )}
          {day.bratabandha && (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Bratabandha"/>
          )} */}
        </div>

        {/* Tooltip for tithi and festival */}
        {(day.tithi || day.festival || events.length > 0) && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-[200px] 
                      invisible group-hover:visible bg-white p-2 rounded-lg shadow-lg 
                      text-xs z-10 border border-gray-200">
            {day.tithi && <div className="text-gray-600">{day.tithi}</div>}
            {day.festival && <div className="text-red-600">{day.festival}</div>}
            {events.length > 0 && (
              <div className="mt-1 pt-1 border-t border-gray-200">
                {events.map(event => (
                  <div key={event.id} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${event.color}`} />
                    <span>{event.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </button>
  );
};