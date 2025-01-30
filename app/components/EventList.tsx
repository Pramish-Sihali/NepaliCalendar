// components/calendar/EventList.tsx
import React from 'react';
import { CalendarEvent } from './types';
import { convertToEnglishDate, formatNepaliDate } from './utils';
import { Card } from '@/components/ui/card';
import { CalendarIcon, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventForm } from './EventForm';
import { Button } from '@/components/ui/button';

interface EventListProps {
  events: CalendarEvent[];
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

interface GroupedEvents {
  [key: string]: CalendarEvent[];
}

const getColorFromClass = (colorClass: string) => {
  const colorMap: { [key: string]: string } = {
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-purple-500': '#a855f7',
    'bg-yellow-500': '#eab308',
    'bg-pink-500': '#ec4899'
  };
  return colorMap[colorClass] || colorClass;
};

export const EventList: React.FC<EventListProps> = ({ 
  events, 
  onEventEdit, 
  onEventDelete 
}) => {
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null);

  const formatEnglishDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventGroups = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groups: Record<string, GroupedEvents> = {
      today: {},
      upcoming: {},
      past: {}
    };

    events.forEach(event => {
      const eventDate = convertToEnglishDate(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const dateKey = eventDate.toISOString();

      if (eventDate.getTime() === today.getTime()) {
        groups.today[dateKey] = groups.today[dateKey] || [];
        groups.today[dateKey].push(event);
      } else if (eventDate > today) {
        groups.upcoming[dateKey] = groups.upcoming[dateKey] || [];
        groups.upcoming[dateKey].push(event);
      } else {
        groups.past[dateKey] = groups.past[dateKey] || [];
        groups.past[dateKey].push(event);
      }
    });

    Object.values(groups).forEach(group => {
      Object.values(group).forEach(dateEvents => {
        dateEvents.sort((a, b) => {
          if (a.isAllDay && !b.isAllDay) return -1;
          if (!a.isAllDay && b.isAllDay) return 1;
          if (!a.time || !b.time) return 0;
          return a.time.localeCompare(b.time);
        });
      });
    });

    return groups;
  };

  const handleEventEdit = (event: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      onEventEdit({
        ...event,
        id: editingEvent.id
      });
      setEditingEvent(null);
    }
  };

  const renderEventGroup = (
    groupTitle: string, 
    events: GroupedEvents,
    showDateDivider: boolean = true
  ) => {
    if (Object.keys(events).length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">{groupTitle}</h3>
        {Object.entries(events)
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(([dateStr, dateEvents]) => {
            const date = new Date(dateStr);
            
            return (
              <div key={dateStr} className="space-y-2">
                {showDateDivider && (
                  <div className="flex items-center gap-2 py-2">
                    <div className="h-px flex-grow bg-gray-200" />
                    <span className="text-sm font-medium text-gray-500">
                      {formatEnglishDate(date)}
                    </span>
                    <div className="h-px flex-grow bg-gray-200" />
                  </div>
                )}
                <div className="space-y-3">
                  {dateEvents.map((event) => {
                    const borderColor = getColorFromClass(event.color);
                    return (
                      <div 
                        key={event.id} 
                        style={{ borderLeftColor: borderColor }}
                        className="relative bg-white rounded-lg shadow-sm border-l-4"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium text-gray-900">{event.title}</h3>
                              {event.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingEvent(event)}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onEventDelete(event.id)}
                                  className="cursor-pointer text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{formatNepaliDate(event.date)}</span>
                              <span className="text-gray-400">|</span>
                              <span>{formatEnglishDate(convertToEnglishDate(event.date))}</span>
                            </div>
                            {!event.isAllDay && event.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {new Date(`2000-01-01T${event.time}`).toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Events</h2>
        <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
          <p>No events scheduled</p>
          <p className="text-sm">Click on any date to add an event</p>
        </div>
      </div>
    );
  }

  const groupedEvents = getEventGroups();

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Events</h2>
        {renderEventGroup("Today", groupedEvents.today, false)}
        {renderEventGroup("Upcoming", groupedEvents.upcoming)}
        {renderEventGroup("Past", groupedEvents.past)}
      </div>

      {editingEvent && (
        <EventForm
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          selectedDate={editingEvent.date}
          onSubmit={handleEventEdit}
          editEvent={editingEvent}
        />
      )}
    </>
  );
};