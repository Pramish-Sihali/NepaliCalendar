// services/events.ts
import { createClient } from '@/utils/supabase/client';
import { CalendarEvent, DatabaseEvent } from '@/app/components/types';
import { eventToDatabase, databaseToEvent, databaseToEvents } from '@/utils/database';

const supabase = createClient();

export class EventsService {
  // Get all events
  static async getAllEvents(): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return databaseToEvents(data as DatabaseEvent[]);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  // Get events for a specific Nepali date
  static async getEventsByDate(year: number, month: number, day?: number): Promise<CalendarEvent[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('nepali_year', year)
        .eq('nepali_month', month);

      if (day !== undefined) {
        query = query.eq('nepali_day', day);
      }

      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching events by date:', error);
        throw error;
      }

      return databaseToEvents(data as DatabaseEvent[]);
    } catch (error) {
      console.error('Failed to fetch events by date:', error);
      throw error;
    }
  }

  // Create a new event
  static async createEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent> {
    try {
      const dbEvent = eventToDatabase(event);
      
      const { data, error } = await supabase
        .from('events')
        .insert([dbEvent])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      return databaseToEvent(data as DatabaseEvent);
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  // Update an existing event
  static async updateEvent(id: string, event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent> {
    try {
      const dbEvent = eventToDatabase(event);
      
      const { data, error } = await supabase
        .from('events')
        .update(dbEvent)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      return databaseToEvent(data as DatabaseEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  // Delete an event
  static async deleteEvent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  // Get events for a specific month
  static async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('nepali_year', year)
        .eq('nepali_month', month)
        .order('nepali_day', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching events for month:', error);
        throw error;
      }

      return databaseToEvents(data as DatabaseEvent[]);
    } catch (error) {
      console.error('Failed to fetch events for month:', error);
      throw error;
    }
  }
}