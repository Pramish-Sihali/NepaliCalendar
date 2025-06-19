// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Calendar from './components/calendar';
import { EventsSection } from './components/EventsSection';
import { CalendarEvent } from './components/types';

const EVENTS_STORAGE_KEY = 'nepali-calendar-events';

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load events from localStorage on component mount
  useEffect(() => {
    const loadEvents = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
          if (savedEvents) {
            const parsedEvents = JSON.parse(savedEvents);
            setEvents(parsedEvents);
          }
        }
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadEvents();
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (isLoaded) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
        }
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
    }
  }, [events, isLoaded]);

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      // Ensure name and organization have default values if not provided
      name: event.name || '',
      organization: event.organization || '',
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

  // Clear all events (optional utility function)
  const handleClearAllEvents = () => {
    if (confirm('Are you sure you want to delete all events? This action cannot be undone.')) {
      setEvents([]);
    }
  };

  // Export events as JSON (optional utility function)
  const handleExportEvents = () => {
    try {
      const dataStr = JSON.stringify(events, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `nepali-calendar-events-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting events:', error);
      alert('Failed to export events');
    }
  };

  // Import events from JSON file (optional utility function)
  const handleImportEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedEvents = JSON.parse(content);
        
        if (Array.isArray(importedEvents)) {
          setEvents(importedEvents);
          alert('Events imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        console.error('Error importing events:', error);
        alert('Failed to import events');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading calendar...</div>
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
            BOARDROOM - पात्रो
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {events.length} event{events.length !== 1 ? 's' : ''} saved locally
          </p>
        </div>
        
        {/* Optional: Add utility buttons */}
        {/* <div className="flex justify-center gap-4 text-sm">
          <input
            type="file"
            accept=".json"
            onChange={handleImportEvents}
            className="hidden"
            id="import-events"
          />
          <label
            htmlFor="import-events"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            Import Events
          </label>
          <button
            onClick={handleExportEvents}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={events.length === 0}
          >
            Export Events
          </button>
          <button
            onClick={handleClearAllEvents}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={events.length === 0}
          >
            Clear All
          </button>
        </div> */}
        
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