// components/calendar/EventList.tsx
import React from 'react';
import { CalendarEvent } from './types';
import { convertToEnglishDate, formatNepaliDate } from './utils';
import { Card } from '@/components/ui/card';
import { CalendarIcon, Clock, MoreVertical, Pencil, Trash2, User, Building, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventForm } from './EventForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    'bg-pink-500': '#ec4899',
    'bg-indigo-500': '#6366f1',
    'bg-orange-500': '#f97316'
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
      month: 'short',
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
          if (!a.startTime || !b.startTime) return 0;
          return a.startTime.localeCompare(b.startTime);
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

  const renderEventCard = (event: CalendarEvent) => {
    const borderColor = getColorFromClass(event.color);
    const englishDate = convertToEnglishDate(event.date);
    
    return (
      <div 
        key={event.id}
        className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
      >
        {/* Color indicator */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: borderColor }}
        />
        
        <div className="p-4 pl-6">
          {/* Header with title and actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {event.description}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => setEditingEvent(event)}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEventDelete(event.id)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact and Organization Info */}
          {(event.name || event.organization) && (
            <div className="mb-3 space-y-1">
              {event.name && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{event.name}</span>
                </div>
              )}
              {event.organization && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{event.organization}</span>
                </div>
              )}
            </div>
          )}

          {/* Date and Time Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-800">{formatNepaliDate(event.date)}</span>
              <span className="text-gray-400">•</span>
              <span>{formatEnglishDate(englishDate)}</span>
            </div>
            
            {!event.isAllDay && event.startTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {new Date(`2000-01-01T${event.startTime}`).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                  {event.endTime && (
                    <>
                      {' - '}
                      {new Date(`2000-01-01T${event.endTime}`).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </>
                  )}
                </span>
              </div>
            )}

            {event.isAllDay && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  All Day
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEventGroup = (
    groupTitle: string, 
    events: GroupedEvents,
    icon?: React.ReactNode
  ) => {
    if (Object.keys(events).length === 0) return null;

    const totalEvents = Object.values(events).reduce((sum, dateEvents) => sum + dateEvents.length, 0);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800">{groupTitle}</h3>
            <Badge variant="outline" className="text-xs">
              {totalEvents}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(events)
            .sort(([dateA], [dateB]) => {
              if (groupTitle === 'Past') return dateB.localeCompare(dateA); // Reverse for past events
              return dateA.localeCompare(dateB);
            })
            .map(([dateStr, dateEvents]) => {
              const date = new Date(dateStr);
              
              return (
                <div key={dateStr} className="space-y-3">
                  {Object.keys(events).length > 1 && (
                    <div className="text-sm font-medium text-gray-500 border-b border-gray-100 pb-2">
                      {formatEnglishDate(date)}
                    </div>
                  )}
                  <div className="space-y-3">
                    {dateEvents.map(renderEventCard)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Events</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">No events scheduled</p>
          <p className="text-sm text-center">Click on any date in the calendar to create your first event</p>
        </div>
      </div>
    );
  }

  const groupedEvents = getEventGroups();

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Events</h2>
          <div className="text-sm text-gray-500">
            {events.length} total event{events.length !== 1 ? 's' : ''}
          </div>
        </div>

        {renderEventGroup(
          "Today", 
          groupedEvents.today,
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        )}
        
        {renderEventGroup(
          "Upcoming", 
          groupedEvents.upcoming,
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
        
        {renderEventGroup(
          "Past", 
          groupedEvents.past,
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        )}
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