// components/calendar/EventList.tsx
import React from 'react';
import { CalendarEvent } from './types';
import { formatNepaliDate } from './utils';

interface EventListProps {
  events: CalendarEvent[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date.year, a.date.month, a.date.day);
    const dateB = new Date(b.date.year, b.date.month, b.date.day);
    return dateA.getTime() - dateB.getTime();
  });

  return ( 
    <div className="space-y-4 ">
      <h2 className="text-xl font-semibold">Events</h2>
      <div className="space-y-2">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${event.color}`} />
              <h3 className="font-medium">{event.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatNepaliDate(event.date)}
              {!event.isAllDay && event.time && ` at ${event.time}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};