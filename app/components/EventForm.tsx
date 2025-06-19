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
import { Calendar as CalendarIcon, User, Building } from "lucide-react";
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
 'bg-indigo-500',
 'bg-orange-500',
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
 const [name, setName] = useState('');
 const [organization, setOrganization] = useState('');
 const [startTime, setStartTime] = useState('');
 const [endTime, setEndTime] = useState('');
 const [isAllDay, setIsAllDay] = useState(false);
 const [selectedColor, setSelectedColor] = useState(colors[0]);
 const [timePickerStep, setTimePickerStep] = useState<'start' | 'end'>('start');

 React.useEffect(() => {
   if (editEvent) {
     setTitle(editEvent.title);
     setDescription(editEvent.description);
     setName(editEvent.name);
     setOrganization(editEvent.organization);
     setStartTime(editEvent.startTime || '');
     setEndTime(editEvent.endTime || '');
     setIsAllDay(editEvent.isAllDay);
     setSelectedColor(editEvent.color);
   } else {
     // Reset form when creating new event
     setTitle('');
     setDescription('');
     setName('');
     setOrganization('');
     setStartTime('');
     setEndTime('');
     setIsAllDay(false);
     setSelectedColor(colors[0]);
     setTimePickerStep('start');
   }
 }, [editEvent, isOpen]);

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
     name,
     organization,
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
   setName('');
   setOrganization('');
   setStartTime('');
   setEndTime('');
   setIsAllDay(false);
   setSelectedColor(colors[0]);
   setTimePickerStep('start');
 };

 return (
   <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className="sm:max-w-[900px] overflow-visible max-h-[90vh] overflow-y-auto">
       <DialogHeader>
         <DialogTitle className="text-xl font-semibold">
           {editEvent ? 'Edit Event' : 'Add New Event'}
         </DialogTitle>
       </DialogHeader>

       <div className="flex gap-8">
         <div className="flex-1 space-y-4">
           <form onSubmit={handleSubmit} className="space-y-4">
             {/* Event Title */}
             <div>
               <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                 Event Title <span className="text-red-500">*</span>
               </Label>
               <Input
                 id="title"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="Enter event title"
                 className="mt-1"
                 required
               />
             </div>

             {/* Name and Organization Row */}
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                   <User className="h-4 w-4" />
                   Contact Name
                 </Label>
                 <Input
                   id="name"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Person or contact name"
                   className="mt-1"
                 />
               </div>
               <div>
                 <Label htmlFor="organization" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                   <Building className="h-4 w-4" />
                   Organization
                 </Label>
                 <Input
                   id="organization"
                   value={organization}
                   onChange={(e) => setOrganization(e.target.value)}
                   placeholder="Company or organization"
                   className="mt-1"
                 />
               </div>
             </div>

             {/* Description */}
             <div>
               <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                 Description
               </Label>
               <Textarea
                 id="description"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Event description or notes"
                 className="mt-1 h-20 resize-none"
               />
             </div>

             {/* Date Display */}
             <div className="bg-gray-50 p-3 rounded-lg">
               <Label className="text-sm font-medium text-gray-700">Date</Label>
               <div className="flex items-center gap-2 text-sm text-gray-800 mt-1">
                 <CalendarIcon className="h-4 w-4 text-blue-500" />
                 <span className="font-medium">{formatNepaliDate(selectedDate)}</span>
                 <span className="text-gray-400">|</span>
                 <span>{englishDate.toLocaleDateString('en-US', {
                   weekday: 'long',
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}</span>
               </div>
             </div>

             {/* All Day Checkbox */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="allDay"
                 checked={isAllDay}
                 onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
               />
               <Label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                 All day event
               </Label>
             </div>

             {/* Time Display */}
             {!isAllDay && startTime && endTime && (
               <div className="bg-blue-50 p-3 rounded-lg">
                 <Label className="text-sm font-medium text-gray-700">Time</Label>
                 <div className="text-sm text-gray-800 mt-1">
                   <span className="font-medium">
                     {new Date(`2000-01-01T${startTime}`).toLocaleTimeString([], {
                       hour: 'numeric',
                       minute: '2-digit',
                       hour12: true
                     })}
                   </span>
                   <span className="mx-2">-</span>
                   <span className="font-medium">
                     {new Date(`2000-01-01T${endTime}`).toLocaleTimeString([], {
                       hour: 'numeric',
                       minute: '2-digit',
                       hour12: true
                     })}
                   </span>
                 </div>
               </div>
             )}

             {/* Color Selection */}
             <div>
               <Label className="text-sm font-medium text-gray-700">Color</Label>
               <div className="flex gap-2 mt-2">
                 {colors.map((color) => (
                   <button
                     key={color}
                     type="button"
                     className={`w-7 h-7 rounded-full ${color} ${
                       selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                     } transition-transform`}
                     onClick={() => setSelectedColor(color)}
                   />
                 ))}
               </div>
             </div>

             {/* Form Actions */}
             <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={onClose}
                 className="px-6"
               >
                 Cancel
               </Button>
               <Button 
                 type="submit"
                 disabled={!isAllDay && (!startTime || !endTime)}
                 className="px-6"
               >
                 {editEvent ? 'Update Event' : 'Create Event'}
               </Button>
             </div>
           </form>
         </div>

         {/* Time Picker Section */}
         {!isAllDay && (
           <div className="flex-1 border-l pl-8">
             <Label className="text-lg font-semibold block mb-4">Set Time</Label>
             {timePickerStep === 'start' ? (
               <div>
                 <Label className="mb-2 block text-sm font-medium">Start Time</Label>
                 <ClockTimePicker
                   value={startTime}
                   onChange={handleStartTimeComplete}
                   label="Select start time"
                 />
               </div>
             ) : (
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <Label className="text-sm font-medium">End Time</Label>
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={() => setTimePickerStep('start')}
                     className="text-xs"
                   >
                     Edit Start ({new Date(`2000-01-01T${startTime}`).toLocaleTimeString([], {
                       hour: 'numeric',
                       minute: '2-digit',
                       hour12: true
                     })})
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