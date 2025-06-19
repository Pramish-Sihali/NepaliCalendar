// app/components/types.ts
export interface NepaliDate {
  year: number;
  month: number;
  day: number;
}

export interface EnglishDate {
  year: number;
  month: number;
  day: number;
}

export interface CalendarData {
  nepali_date: string;
  english_date: string;
  tithi: string;
  festival: string;
  holiday: boolean;
  marriage_date: boolean;
  bratabandha: boolean;
  day_of_week: number;
  isOutsideMonth?: boolean;
}

export interface MonthInfo {
  year: number;
  month: number;
  month_name: string;
  total_days: number;
  start_day_of_week: number;
  is_leap_month: boolean;
}

export interface DaysInMonthMap {
  [key: number]: number[];
}

export interface MonthStartMap {
  [key: string]: Array<{
    year: number;
    month: number;
    day: number;
  }>;
}

export interface CalendarProps {
  events: CalendarEvent[];
  onEventAdd: (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => void;
  selectedDate?: NepaliDate | null;
  onDateSelect?: (date: NepaliDate) => void;
}

// Updated CalendarEvent interface to match database schema
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  name: string;           // Person/Contact name
  organization: string;   // Organization/Company
  date: NepaliDate;       // This will be converted to/from nepali_year, nepali_month, nepali_day
  startTime?: string;     // Maps to start_time in DB
  endTime?: string;       // Maps to end_time in DB
  isAllDay: boolean;      // Maps to is_all_day in DB
  color: string;
  created_at?: string;    // Added database field
  updated_at?: string;    // Added database field
}

// Database row interface (what we get from Supabase)
export interface DatabaseEvent {
  id: string;
  title: string;
  description: string;
  name: string;
  organization: string;
  nepali_year: number;
  nepali_month: number;
  nepali_day: number;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}