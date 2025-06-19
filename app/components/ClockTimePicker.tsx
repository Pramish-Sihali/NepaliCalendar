// components/calendar/ClockTimePicker.tsx
import React, { useState } from 'react';

import { Button } from "@/components/ui/button";

interface ClockTimePickerProps {
 value: string;
 onChange: (time: string) => void;
 label: string;
 minTime?: string;
}

export const ClockTimePicker: React.FC<ClockTimePickerProps> = ({

 onChange,

 minTime
}) => {
 const [isHourView, setIsHourView] = useState(true);
 const [selectedHour, setSelectedHour] = useState<number | null>(null);
 const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
 const [isPM, setIsPM] = useState(false);
 const [tempTime, setTempTime] = useState('');
 const [error, setError] = useState('');

 const formatTimeDisplay = () => {
   if (!selectedHour && selectedHour !== 0) return '--:--';
   const hour = selectedHour === 12 && !isPM ? '00' : 
                selectedHour === 12 && isPM ? '12' : 
                isPM ? (selectedHour + 12).toString().padStart(2, '0') : 
                selectedHour.toString().padStart(2, '0');
   const minute = selectedMinute === null ? '--' : 
                 selectedMinute.toString().padStart(2, '0');
   return `${hour}:${minute} ${isPM ? 'PM' : 'AM'}`;
 };

 const validateTime = (hour: number, minute: number, isPM: boolean) => {
   if (!minTime) return true;

   const [minHour, minMinute] = minTime.split(':').map(Number);
   const currentHour = (hour === 12 ? 0 : hour) + (isPM ? 12 : 0);
   const currentMinutes = currentHour * 60 + minute;
   const minMinutes = minHour * 60 + minMinute;

   return currentMinutes > minMinutes;
 };

 const handleHourSelect = (hour: number) => {
   setSelectedHour(hour);
   setIsHourView(false);
   setError('');
 };

 const handleMinuteSelect = (minute: number) => {
   if (selectedHour === null) return;
   setSelectedMinute(minute);
   const hour = (selectedHour === 12 ? 0 : selectedHour) + (isPM ? 12 : 0);
   setTempTime(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
 };

 const handleTimeConfirm = () => {
   if (!selectedHour || selectedMinute === null) return;

   const isValid = validateTime(selectedHour, selectedMinute, isPM);
   if (!isValid) {
     setError('End time must be after start time');
     return;
   }

   onChange(tempTime);
   setError('');
   setIsHourView(true);
 };

 const handleAMPMToggle = (newIsPM: boolean) => {
   setIsPM(newIsPM);
   if (selectedHour !== null && selectedMinute !== null) {
     const hour = selectedHour === 12 ? (newIsPM ? 12 : 0) : selectedHour + (newIsPM ? 12 : 0);
     setTempTime(`${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`);
     setError('');
   }
 };

 const getHandAngle = () => {
  if (isHourView && selectedHour) {
    // For hours: Each hour represents 30 degrees (360/12)
    // Subtract 90 to start at 12 o'clock
    return (selectedHour * 30) - 90;
  } else if (!isHourView && selectedMinute !== null) {
    // For minutes: Each minute represents 6 degrees (360/60)
    // Subtract 90 to start at 12 o'clock
    return (selectedMinute * 6) - 90;
  }
  return 0;
};

 const getNumberPosition = (num: number, isHour: boolean) => {
   const angle = ((isHour ? num : num / 5) * 30 - 90) * (Math.PI / 180);
   const radius = 100;
   const x = Math.cos(angle) * radius + 128;
   const y = Math.sin(angle) * radius + 128;
   return { x, y };
 };

 const hours = Array.from({ length: 12 }, (_, i) => i + 1);
 const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

 return (
   <div className="inline-block">
     <div className="text-xl font-semibold mb-4 text-center">
       {formatTimeDisplay()}
     </div>
     {error && (
       <div className="text-red-500 text-sm text-center mb-4">
         {error}
       </div>
     )}
     <div className="relative w-64 h-64">
       <div className="absolute inset-0 rounded-full border-2 border-gray-200 bg-white">
         <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2 z-10" />
         
         {(selectedHour !== null || selectedMinute !== null) && (
           <div
             className="absolute top-1/2 left-1/2 w-1 bg-blue-500 rounded-full"
             style={{
               height: '30%',
               transformOrigin: '50% 0',
               transform: `translate(-50%, 0) rotate(${getHandAngle() - 90}deg)`,
               zIndex: 5
             }}
           />
         )}
         
         {(isHourView ? hours : minutes).map((num) => {
           const pos = getNumberPosition(num, isHourView);
           const isSelected = isHourView 
             ? num === selectedHour 
             : num === selectedMinute;

           return (
             <button
               key={num}
               onClick={() => isHourView ? handleHourSelect(num) : handleMinuteSelect(num)}
               className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full
                 flex items-center justify-center text-sm transition-colors
                 ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
               style={{
                 left: `${pos.x}px`,
                 top: `${pos.y}px`,
                 zIndex: 20
               }}
             >
               {isHourView ? num : (num === 0 ? '00' : num)}
             </button>
           );
         })}
       </div>

       <div className="absolute -right-16 top-0 flex flex-col gap-2">
         <button
           onClick={() => handleAMPMToggle(false)}
           className={`px-3 py-1 rounded ${!isPM ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
         >
           AM
         </button>
         <button
           onClick={() => handleAMPMToggle(true)}
           className={`px-3 py-1 rounded ${isPM ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
         >
           PM
         </button>
       </div>
     </div>

     <div className="mt-4 flex justify-end">
       {!isHourView && selectedMinute !== null && (
         <div className="space-x-2">
           <Button type="button" variant="outline" onClick={() => setIsHourView(true)}>
             Back to Hours
           </Button>
           <Button type="button" onClick={handleTimeConfirm}>
             Set Time
           </Button>
         </div>
       )}
     </div>
   </div>
 );
};