// components/calendar/EventForm.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarEvent, NepaliDate } from './types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: NepaliDate;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
}

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
];

export const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSubmit,
}) => {
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('');
  const [isAllDay, setIsAllDay] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      date: selectedDate,
      time: isAllDay ? undefined : time,
      isAllDay,
      color: selectedColor,
    });
    setTitle('');
    setTime('');
    setIsAllDay(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={isAllDay}
              onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
            />
            <Label htmlFor="allDay">All day</Label>
          </div>

          {!isAllDay && (
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full ${color} ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};