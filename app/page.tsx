// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Calendar from './components/calendar';
import { EventsSection } from './components/EventsSection';
import { TimelineView } from './components/TimelineView';
import { CalendarEvent, NepaliDate } from './components/types';
import { EventsService } from '@/services/events';
import { findCurrentNepaliDate } from './components/utils';

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<NepaliDate | null>(() => {
    // Initialize with current Nepali date
    return findCurrentNepaliDate(new Date());
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load events from Supabase on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedEvents = await EventsService.getAllEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setError('Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    loadEvents();
  }, []);

  const handleAddEvent = async (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newEvent = await EventsService.createEvent(event);
      setEvents((prev) => [newEvent, ...prev]);
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Failed to add event. Please try again.');
    }
  };

  const handleEditEvent = async (updatedEvent: CalendarEvent) => {
    try {
      setError(null);
      const updated = await EventsService.updateEvent(updatedEvent.id, updatedEvent);
      setEvents((prev) => 
        prev.map((event) => 
          event.id === updated.id ? updated : event
        )
      );
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setError(null);
      await EventsService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };




  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">
              {isLoading ? 'Loading calendar...' : 'Initializing...'}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Boardroom Meeting and Events planner
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {events.length} event{events.length !== 1 ? 's' : ''} in shared calendar
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
        
       
        
        <div className="grid grid-cols-12 gap-8">
          {/* Left side - Calendar and Events List */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <Calendar 
              events={events} 
              onEventAdd={handleAddEvent}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <EventsSection 
              events={events}
              onEventEdit={handleEditEvent}
              onEventDelete={handleDeleteEvent}
            />
          </div>
          
          {/* Right side - Timeline */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-8">
              <TimelineView 
                selectedDate={selectedDate}
                events={events}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}