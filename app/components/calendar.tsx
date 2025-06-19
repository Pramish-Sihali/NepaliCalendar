// components/calendar/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';
import { findCurrentNepaliDate, debugDateConversion } from './utils';
import type { CalendarProps, CalendarData, MonthInfo, NepaliDate } from './types';
import { EventForm } from './EventForm';

const weekdays = ["आईत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

export const Calendar: React.FC<CalendarProps> = ({ 
  events = [], 
  onEventAdd, 
  selectedDate: externalSelectedDate,
  onDateSelect 
}) => {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [monthInfo, setMonthInfo] = useState<MonthInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<NepaliDate | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  
  // Initialize with current date
  const [currentNepaliDate, setCurrentNepaliDate] = useState<NepaliDate>(() => {
    const today = new Date();
    const nepaliToday = findCurrentNepaliDate(today);
    
    // Add debug logging
    console.log('=== CALENDAR INITIALIZATION ===');
    console.log('Today (English):', today.toDateString());
    console.log('Converted to Nepali:', nepaliToday);
    debugDateConversion();
    
    return nepaliToday;
  });

  const loadMonthData = async (year: number, month: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/calendar-data/${year}/${month}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch calendar data');
      }

      setCalendarData(result.data);
      setMonthInfo(result.info);
      setError(null);
    } catch (err) {
      console.error('Error loading calendar data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load calendar data');
      setCalendarData([]);
      setMonthInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthData(currentNepaliDate.year, currentNepaliDate.month);
  }, [currentNepaliDate.year, currentNepaliDate.month]);

  const handlePrevMonth = () => {
    setCurrentNepaliDate(prev => ({
      year: prev.month === 0 ? prev.year - 1 : prev.year,
      month: prev.month === 0 ? 11 : prev.month - 1,
      day: 1
    }));
  };

  const handleNextMonth = () => {
    setCurrentNepaliDate(prev => ({
      year: prev.month === 11 ? prev.year + 1 : prev.year,
      month: prev.month === 11 ? 0 : prev.month + 1,
      day: 1
    }));
  };

  const handleMonthChange = (month: number) => {
    setCurrentNepaliDate(prev => ({
      ...prev,
      month,
      day: 1
    }));
  };

  const handleYearChange = (year: number) => {
    setCurrentNepaliDate(prev => ({
      ...prev,
      year,
      day: 1
    }));
  };

  const handleDateClick = (date: CalendarData) => {
    const newDate: NepaliDate = {
      year: currentNepaliDate.year,
      month: currentNepaliDate.month,
      day: parseInt(date.nepali_date)
    };
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
    setIsEventFormOpen(true);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading calendar...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // Get day events for a specific day
  const getDayEvents = (nepaliDate: string) => {
    return events.filter(event => 
      event.date.year === currentNepaliDate.year &&
      event.date.month === currentNepaliDate.month &&
      event.date.day === parseInt(nepaliDate)
    );
  };

  // Get today's Nepali date for highlighting
  const todayNepaliDate = findCurrentNepaliDate(new Date());
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CalendarHeader
        currentNepaliDate={currentNepaliDate}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <CardContent>
        {/* Debug info */}
        {/* <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <strong>Debug:</strong> Today's Nepali Date: {todayNepaliDate.year}/{todayNepaliDate.month + 1}/{todayNepaliDate.day} | 
          Viewing: {currentNepaliDate.year}/{currentNepaliDate.month + 1} | 
          English Today: {new Date().toDateString()}
        </div> */}

        <div className="calendar-grid">
          <div className="grid grid-cols-7 mb-2">
            {weekdays.map((day, index) => (
              <div 
                key={day} 
                className={`
                  text-center h-10 flex items-center justify-center font-bold text-sm text-gray-600
                  ${index === 6 ? 'text-red-600' : ''}
                `}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthInfo && Array.from({ length: monthInfo.start_day_of_week }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square p-1" />
            ))}

            {calendarData.map((day, index) => {
              const isCurrentDay = 
                currentNepaliDate.year === todayNepaliDate.year &&
                currentNepaliDate.month === todayNepaliDate.month &&
                parseInt(day.nepali_date) === todayNepaliDate.day;

              const isSelected = (externalSelectedDate && 
                currentNepaliDate.year === externalSelectedDate.year &&
                currentNepaliDate.month === externalSelectedDate.month &&
                parseInt(day.nepali_date) === externalSelectedDate.day) ||
                (selectedDate?.day === parseInt(day.nepali_date));

              return (
                <DayCell
                  key={`day-${index}`}
                  day={day}
                  dayOfWeek={(index + (monthInfo?.start_day_of_week || 0)) % 7}
                  isSelected={isSelected}
                  isToday={isCurrentDay}
                  events={getDayEvents(day.nepali_date)}
                  onClick={() => handleDateClick(day)}
                />
              );
            })}
          </div>
        </div>
      </CardContent>

      {selectedDate && (
        <EventForm
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          selectedDate={selectedDate}
          onSubmit={onEventAdd}
        />
      )}
    </Card>
  );
};

export default Calendar;