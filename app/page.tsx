// app/page.tsx
'use client';

import { useState } from 'react';
import Calendar from './components/calendar';
import { EventsSection } from './components/EventsSection';
import { CalendarEvent } from './components/types';

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) => 
      prev.map((event) => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          नेपाली पात्रो
        </h1>
        
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="sticky top-8">
              <Calendar events={events} onEventAdd={handleAddEvent} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-8">
              <EventsSection 
                events={events}
                onEventEdit={handleEditEvent}
                onEventDelete={handleDeleteEvent}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}