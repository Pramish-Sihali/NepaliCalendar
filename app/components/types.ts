// types.ts
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
}

export interface MonthInfo {
  year: number;
  month: number;
  month_name: string;
  total_days: number;
  start_day_of_week: number;
  is_leap_month: boolean;
}

// export interface CalendarProps {
//   onDateSelect?: (eng: Date, nep: { year: number; month: number; date: number }) => void;
// }

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

// types.ts
export interface CalendarProps {
  events: CalendarEvent[];
  onEventAdd: (event: Omit<CalendarEvent, 'id'>) => void;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: NepaliDate;
  time?: string;
  isAllDay: boolean;
  color: string;
}