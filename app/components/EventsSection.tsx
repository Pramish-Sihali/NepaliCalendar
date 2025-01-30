// components/calendar/EventsSection.tsx
import React from 'react';
import { CalendarEvent } from './types';
import { EventList } from './EventList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface EventsSectionProps {
  events: CalendarEvent[];
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

const nepaliMonths = [
  { nepali: 'सबै महिना', english: 'All Months' },
  { nepali: 'बैशाख', english: 'April/May' },
  { nepali: 'जेष्ठ', english: 'May/June' },
  { nepali: 'असार', english: 'June/July' },
  { nepali: 'श्रावण', english: 'July/August' },
  { nepali: 'भदौ', english: 'August/September' },
  { nepali: 'असोज', english: 'September/October' },
  { nepali: 'कार्तिक', english: 'October/November' },
  { nepali: 'मंसिर', english: 'November/December' },
  { nepali: 'पुष', english: 'December/January' },
  { nepali: 'माघ', english: 'January/February' },
  { nepali: 'फागुन', english: 'February/March' },
  { nepali: 'चैत्र', english: 'March/April' }
];

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onEventEdit,
  onEventDelete
}) => {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("सबै महिना");

  const filteredEvents = selectedMonth === "सबै महिना" 
    ? events 
    : events.filter(event => {
        const monthIndex = event.date.month;
        return nepaliMonths[monthIndex + 1].nepali === selectedMonth;
      });

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">Events</h2>
            <p className="text-sm text-gray-500">
              {events.length} total event{events.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              {nepaliMonths.map((month) => (
                <SelectItem key={month.nepali} value={month.nepali}>
                  {month.nepali} ({month.english})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent" 
             style={{ 
               maxHeight: 'calc(100vh - 300px)',
               minHeight: '400px'
             }}>
          <div className="p-6">
            <EventList 
              events={filteredEvents} 
              onEventEdit={onEventEdit}
              onEventDelete={onEventDelete}
            />
          </div>
        </div>

        {/* Gradient overlays for scroll indication */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </Card>
  );
};