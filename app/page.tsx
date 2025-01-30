// app/page.tsx
'use client';

import { useState } from 'react';
import Calendar from './components/calendar';
import { EventList } from './components/EventList';
import { CalendarEvent, NepaliDate } from './components/types';

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          नेपाली पात्रो
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* <Calendar events={events} onEventAdd={handleAddEvent} /> */}
            <Calendar 
  events={events} 
  onEventAdd={handleAddEvent} 
/>
          </div>
          <div>
            <div className="bg-white p-4 rounded border-2 border-dashed border-red-500">
            <EventList events={events} />
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}