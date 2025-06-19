// utils/database.ts
import { CalendarEvent, DatabaseEvent, NepaliDate } from '@/app/components/types';

// Convert CalendarEvent to database format
export function eventToDatabase(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Omit<DatabaseEvent, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: event.title,
    description: event.description,
    name: event.name,
    organization: event.organization,
    nepali_year: event.date.year,
    nepali_month: event.date.month,
    nepali_day: event.date.day,
    start_time: event.startTime || null,
    end_time: event.endTime || null,
    is_all_day: event.isAllDay,
    color: event.color,
  };
}

// Convert database row to CalendarEvent
export function databaseToEvent(dbEvent: DatabaseEvent): CalendarEvent {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    name: dbEvent.name,
    organization: dbEvent.organization,
    date: {
      year: dbEvent.nepali_year,
      month: dbEvent.nepali_month,
      day: dbEvent.nepali_day,
    },
    startTime: dbEvent.start_time || undefined,
    endTime: dbEvent.end_time || undefined,
    isAllDay: dbEvent.is_all_day,
    color: dbEvent.color,
    created_at: dbEvent.created_at,
    updated_at: dbEvent.updated_at,
  };
}

// Convert database rows to CalendarEvent array
export function databaseToEvents(dbEvents: DatabaseEvent[]): CalendarEvent[] {
  return dbEvents.map(databaseToEvent);
}