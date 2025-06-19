// app/components/TimelineView.tsx
import React from 'react';
import { CalendarEvent, NepaliDate } from './types';
import { formatNepaliDate } from './utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Calendar as CalendarIcon, User, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimelineViewProps {
  selectedDate: NepaliDate | null;
  events: CalendarEvent[];
}

interface TimeSlot {
  hour: number;
  time12: string;
  time24: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  selectedDate,
  events
}) => {
  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ hour, time12, time24 });
    }
    return slots;
  };

  // Filter events for the selected date
  const dayEvents = selectedDate ? events.filter(event => 
    event.date.year === selectedDate.year &&
    event.date.month === selectedDate.month &&
    event.date.day === selectedDate.day
  ) : [];

  // Get events for a specific hour - including events that span through this hour
  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      if (event.isAllDay) return false; // Handle all-day events separately
      if (!event.startTime) return false;
      
      const startHour = parseInt(event.startTime.split(':')[0]);
      
      // If no end time, only show in start hour
      if (!event.endTime) {
        return startHour === hour;
      }
      
      const endHour = parseInt(event.endTime.split(':')[0]);
      const endMinute = parseInt(event.endTime.split(':')[1]);
      
      // Adjust end hour if end time is exactly on the hour (don't include that hour)
      const actualEndHour = endMinute === 0 ? endHour - 1 : endHour;
      
      // Event spans through this hour if hour is between start and end
      return hour >= startHour && hour <= actualEndHour;
    });
  };

  // Check if event starts in this hour
  const isEventStartHour = (event: CalendarEvent, hour: number) => {
    if (!event.startTime) return false;
    const startHour = parseInt(event.startTime.split(':')[0]);
    return startHour === hour;
  };

  // Check if event continues from previous hour
  // const isEventContinuation = (event: CalendarEvent, hour: number) => {
  //   if (!event.startTime || !event.endTime) return false;
  //   const startHour = parseInt(event.startTime.split(':')[0]);
  //   return hour > startHour;
  // };

  // Calculate event duration in hours
  const getEventDuration = (event: CalendarEvent) => {
    if (!event.startTime || !event.endTime) return 1;
    
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  };

  // Get all-day events
  const allDayEvents = dayEvents.filter(event => event.isAllDay);

  // Get color from class string
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
    return colorMap[colorClass] || '#3b82f6';
  };

  const timeSlots = generateTimeSlots();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-500" />
          Daily Timeline
        </CardTitle>
        {selectedDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatNepaliDate(selectedDate)}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {!selectedDate ? (
          // This shouldn't happen now since we initialize with current date
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6">
            <Clock className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">Select a Date</p>
            <p className="text-sm text-center">Click on any date in the calendar to view the timeline for that day</p>
          </div>
        ) : (
          <div className="relative">
            {/* All-day events section */}
            {allDayEvents.length > 0 && (
              <div className="border-b border-gray-100 p-4 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 mb-2">ALL DAY</div>
                <div className="space-y-2">
                  {allDayEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 p-2 rounded-md text-sm"
                      style={{ 
                        backgroundColor: getColorFromClass(event.color) + '20',
                        borderLeft: `3px solid ${getColorFromClass(event.color)}`
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{event.title}</div>
                        {event.name && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="h-3 w-3" />
                            <span className="truncate">{event.name}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">All Day</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((slot, index) => {
                const hourEvents = getEventsForHour(slot.hour);
                const isCurrentHour = (() => {
                  const now = new Date();
                  const currentHour = now.getHours();
                  return currentHour === slot.hour;
                })();

                return (
                  <div key={slot.hour} className="relative">
                    {/* Time label */}
                    <div className="flex">
                      <div className="w-20 flex-shrink-0 p-3 text-right">
                        <div className={`text-xs font-medium ${
                          isCurrentHour ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {slot.time12}
                        </div>
                      </div>
                      
                      {/* Events area */}
                      <div className="flex-1 min-h-[60px] border-l border-gray-200 relative">
                        {isCurrentHour && (
                          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-blue-400 opacity-50 z-10" />
                        )}
                        
                        {hourEvents.length > 0 ? (
                          <div className="p-2 space-y-1">
                            {hourEvents.map(event => {
                              const isStart = isEventStartHour(event, slot.hour);
                              const duration = getEventDuration(event);
                              
                              return (
                                <div
                                  key={`${event.id}-${slot.hour}`}
                                  className={`rounded-md border-l-4 text-sm shadow-sm border ${
                                    isStart ? 'p-3 bg-white' : 'p-2 bg-gray-50'
                                  }`}
                                  style={{ 
                                    backgroundColor: isStart 
                                      ? getColorFromClass(event.color) + '10'
                                      : getColorFromClass(event.color) + '05',
                                    borderLeftColor: getColorFromClass(event.color)
                                  }}
                                >
                                  {isStart ? (
                                    // Full event details for start hour
                                    <>
                                      {/* Event Title - More Prominent */}
                                      <div className="font-semibold text-gray-900 leading-tight mb-2 text-base">
                                        {event.title}
                                        {duration > 1 && (
                                          <span className="text-xs font-normal text-gray-500 ml-2">
                                            ({duration}h duration)
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Time range - More visible */}
                                      <div className="flex items-center gap-1 text-sm text-gray-700 mb-2 font-medium">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {event.startTime && new Date(`2000-01-01T${event.startTime}`).toLocaleTimeString([], {
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

                                      {/* Contact info */}
                                      {(event.name || event.organization) && (
                                        <div className="space-y-1 mb-2">
                                          {event.name && (
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                              <User className="h-3 w-3" />
                                              <span className="truncate font-medium">{event.name}</span>
                                            </div>
                                          )}
                                          {event.organization && (
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                              <Building className="h-3 w-3" />
                                              <span className="truncate">{event.organization}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {event.description && (
                                        <div className="text-sm text-gray-600 mt-2 italic">
                                          {event.description}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    // Continuation indicator for ongoing hours
                                    <div className="flex items-center gap-2">
                                      <div className="text-sm font-medium text-gray-700 truncate">
                                        ↳ {event.title} (continuing)
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        ends {event.endTime && new Date(`2000-01-01T${event.endTime}`).toLocaleTimeString([], {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex items-center pl-4">
                            <div className="text-sm text-gray-300 italic">No events</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Hour separator */}
                    {index < timeSlots.length - 1 && (
                      <div className="ml-20 border-b border-gray-100" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                {dayEvents.length === 0 
                  ? 'No events scheduled for this day'
                  : `${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''} scheduled`
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};