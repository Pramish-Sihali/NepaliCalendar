import React, { useState } from 'react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { convertToEnglishDate, formatNepaliDate } from './utils';
import { Calendar as CalendarIcon } from "lucide-react";
import { ClockTimePicker } from './ClockTimePicker';
import { NepaliDate, CalendarEvent } from './types';

interface EventFormProps {
 isOpen: boolean;
 onClose: () => void;
 selectedDate: NepaliDate;
 onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
 editEvent?: CalendarEvent;
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
 editEvent
}) => {
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [startTime, setStartTime] = useState('');
 const [endTime, setEndTime] = useState('');
 const [isAllDay, setIsAllDay] = useState(false);
 const [selectedColor, setSelectedColor] = useState(colors[0]);
 const [timePickerStep, setTimePickerStep] = useState<'start' | 'end'>('start');

 React.useEffect(() => {
   if (editEvent) {
     setTitle(editEvent.title);
     setDescription(editEvent.description);
     setStartTime(editEvent.startTime || '');
     setEndTime(editEvent.endTime || '');
     setIsAllDay(editEvent.isAllDay);
     setSelectedColor(editEvent.color);
   }
 }, [editEvent]);

 const handleStartTimeComplete = (time: string) => {
   setStartTime(time);
   setTimePickerStep('end');
 };

 const handleEndTimeComplete = (time: string) => {
   setEndTime(time);
 };

 const englishDate = React.useMemo(() => 
   convertToEnglishDate(selectedDate), [selectedDate]
 );

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   onSubmit({
     title,
     description,
     date: selectedDate,
     startTime: isAllDay ? undefined : startTime,
     endTime: isAllDay ? undefined : endTime,
     isAllDay,
     color: selectedColor,
   });
   resetForm();
   onClose();
 };

 const resetForm = () => {
   setTitle('');
   setDescription('');
   setStartTime('');
   setEndTime('');
   setIsAllDay(false);
   setSelectedColor(colors[0]);
   setTimePickerStep('start');
 };

 return (
   <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className="sm:max-w-[800px] overflow-visible">
       <DialogHeader>
         <DialogTitle>{editEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
       </DialogHeader>

       <div className="flex gap-8">
         <div className="flex-1 space-y-4">
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

             <div>
               <Label htmlFor="description">Description</Label>
               <Textarea
                 id="description"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Enter event description"
                 className="h-24"
               />
             </div>

             <div className="space-y-2">
               <Label>Date</Label>
               <div className="flex items-center gap-2 text-sm text-gray-600">
                 <CalendarIcon className="h-4 w-4" />
                 <span>{formatNepaliDate(selectedDate)}</span>
                 <span className="text-gray-400">|</span>
                 <span>{englishDate.toLocaleDateString()}</span>
               </div>
             </div>

             <div className="flex items-center space-x-2">
               <Checkbox
                 id="allDay"
                 checked={isAllDay}
                 onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
               />
               <Label htmlFor="allDay">All day</Label>
             </div>

             {startTime && endTime && (
               <div className="text-sm text-gray-600">
                 Time: {startTime} - {endTime}
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

             <div className="flex justify-end gap-2 pt-4">
               <Button type="button" variant="outline" onClick={onClose}>
                 Cancel
               </Button>
               <Button 
                 type="submit"
                 disabled={!isAllDay && (!startTime || !endTime)}
               >
                 {editEvent ? 'Update Event' : 'Add Event'}
               </Button>
             </div>
           </form>
         </div>

         {!isAllDay && (
           <div className="flex-1 border-l pl-8">
             <Label className="text-lg font-semibold block mb-4">Set Time</Label>
             {timePickerStep === 'start' ? (
               <div>
                 <Label className="mb-2 block">Start Time</Label>
                 <ClockTimePicker
                   value={startTime}
                   onChange={handleStartTimeComplete}
                   label="Select start time"
                 />
               </div>
             ) : (
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <Label>End Time</Label>
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={() => setTimePickerStep('start')}
                   >
                     Edit Start Time ({startTime})
                   </Button>
                 </div>
                 <ClockTimePicker
                   value={endTime}
                   onChange={handleEndTimeComplete}
                   label="Select end time"
                   minTime={startTime}
                 />
               </div>
             )}
           </div>
         )}
       </div>
     </DialogContent>
   </Dialog>
 );
};