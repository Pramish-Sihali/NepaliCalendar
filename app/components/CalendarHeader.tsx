// components/calendar/CalendarHeader.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarHeaderProps {
  currentNepaliDate: {
    year: number;
    month: number;
  };
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
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

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentNepaliDate,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth
}) => {
  const years = Array.from({ length: 5 }, (_, i) => 2081 + i);

  return (
    <CardHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="flex gap-2">
          <Select
            value={currentNepaliDate.month.toString()}
            onValueChange={(value) => onMonthChange(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {nepaliMonths.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month} ({englishMonths[index]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentNepaliDate.year.toString()}
            onValueChange={(value) => onYearChange(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="text-center">
        <CardTitle className="text-2xl">
          {nepaliMonths[currentNepaliDate.month]} {currentNepaliDate.year}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {englishMonths[currentNepaliDate.month]}
        </p>
      </div>
    </CardHeader>
  );
};
