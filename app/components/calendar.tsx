import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarData, NepaliDate, MonthInfo, CalendarProps } from './types';

interface DayCellProps {
  day: CalendarData;
  dayOfWeek: number;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

const nepaliMonths = [
  'बैशाख', 'जेष्ठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत्र'
];

const englishMonths = [
  'April/May', 'May/June', 'June/July', 'July/August', 'August/September', 
  'September/October', 'October/November', 'November/December', 
  'December/January', 'January/February', 'February/March', 'March/April'
];

const weekdays = ["आईत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

const DayCell: React.FC<DayCellProps> = ({ 
  day, 
  dayOfWeek,
  isSelected, 
  isToday,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        aspect-square p-1 rounded-lg
        hover:bg-gray-50 transition-colors duration-200
        relative group
        ${isSelected ? 'bg-blue-50 border-2 border-blue-300' : 'border border-gray-100'}
        ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className={`
          text-lg font-semibold
          ${dayOfWeek === 0 ? 'text-gray-600' : ''}
          ${dayOfWeek === 6 ? 'text-red-600' : 'text-gray-800'}
          ${isSelected ? 'text-blue-700' : ''}
        `}>
          {day.nepali_date}
        </span>
        <span className="text-xs text-gray-500">
          {day.english_date}
        </span>
        <div className="absolute top-0.5 right-0.5 flex gap-0.5">
          {day.holiday && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Holiday"/>
          )}
          {day.marriage_date && (
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Marriage Date"/>
          )}
          {day.bratabandha && (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Bratabandha"/>
          )}
        </div>
        {(day.tithi || day.festival) && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-[200px] 
                        invisible group-hover:visible bg-white p-2 rounded-lg shadow-lg 
                        text-xs z-10 border border-gray-200">
            {day.tithi && <div className="text-gray-600">{day.tithi}</div>}
            {day.festival && <div className="text-red-600">{day.festival}</div>}
          </div>
        )}
      </div>
    </button>
  );
};

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [monthInfo, setMonthInfo] = useState<MonthInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<NepaliDate | null>(null);
  const [currentNepaliDate, setCurrentNepaliDate] = useState<NepaliDate>({
    year: 2081,
    month: 0,
    day: 1
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

  const handleDateClick = (date: CalendarData) => {
    const newDate: NepaliDate = {
      year: currentNepaliDate.year,
      month: currentNepaliDate.month,
      day: parseInt(date.nepali_date)
    };
    setSelectedDate(newDate);

    if (onDateSelect) {
      const [month, day] = [
        parseInt(date.english_date) <= 15 ? 3 : 4,
        parseInt(date.english_date)
      ];
      const englishDate = new Date(2025, month, day);
      onDateSelect(englishDate, {
        year: newDate.year,
        month: newDate.month,
        date: newDate.day
      });
    }
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="text-center">
          <CardTitle className="text-2xl">
            {nepaliMonths[currentNepaliDate.month]} {currentNepaliDate.year}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {englishMonths[currentNepaliDate.month]}
          </p>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </CardHeader>

      <CardContent>
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

            {calendarData.map((day, index) => (
              <DayCell
                key={`day-${index}`}
                day={day}
                dayOfWeek={(index + (monthInfo?.start_day_of_week || 0)) % 7}
                isSelected={selectedDate?.day === parseInt(day.nepali_date)}
                isToday={false}
                onClick={() => handleDateClick(day)}
              />
            ))}
          </div>
        </div>

        {/* <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
              <span>Holiday</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span>Marriage Date</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
              <span>Bratabandha</span>
            </div>
          </div>
        </div> */}

      </CardContent>
    </Card>
  );
};

export default Calendar;