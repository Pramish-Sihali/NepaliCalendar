// utils.ts
import { NepaliDate } from './types';
import { monthStartMapping, daysInMonthNepali } from './constants';

export const findCurrentNepaliDate = (englishDate: Date): NepaliDate => {
  const year = englishDate.getFullYear();
  const month = englishDate.getMonth();
  const day = englishDate.getDate();
  
  console.log('Converting English date:', { year, month, day, fullDate: englishDate.toDateString() });
  
  // Normalize the English date to avoid timezone issues
  const normalizedDate = new Date(year, month, day);

  // Check each Nepali year to find the correct one
  for (const [nepaliYearStr, months] of Object.entries(monthStartMapping)) {
    const nepaliYear = parseInt(nepaliYearStr);
    
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
      const currentMonth = months[monthIndex];
      const nextMonth = months[monthIndex + 1];
      
      const currentMonthStart = new Date(currentMonth.year, currentMonth.month, currentMonth.day);
      
      let nextMonthStart: Date;
      if (nextMonth) {
        nextMonthStart = new Date(nextMonth.year, nextMonth.month, nextMonth.day);
      } else {
        // If it's the last month of the year, use the first month of next year
        const nextYearMapping = monthStartMapping[(nepaliYear + 1).toString()];
        if (nextYearMapping) {
          const nextYearFirstMonth = nextYearMapping[0];
          nextMonthStart = new Date(nextYearFirstMonth.year, nextYearFirstMonth.month, nextYearFirstMonth.day);
        } else {
          // Fallback: add approximate days for the last month
          nextMonthStart = new Date(currentMonthStart);
          nextMonthStart.setDate(nextMonthStart.getDate() + (daysInMonthNepali[nepaliYear]?.[monthIndex] || 30));
        }
      }

      // Check if the English date falls within this Nepali month
      if (normalizedDate >= currentMonthStart && normalizedDate < nextMonthStart) {
        const diffTime = normalizedDate.getTime() - currentMonthStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const nepaliDay = diffDays + 1;
        
        const result = {
          year: nepaliYear,
          month: monthIndex,
          day: nepaliDay
        };
        
        console.log('Found matching Nepali date:', result);
        console.log('Month start:', currentMonthStart.toDateString());
        console.log('Days difference:', diffDays);
        return result;
      }
    }
  }

  // Fallback to a default if no match found
  console.warn('No matching Nepali date found, using fallback');
  return {
    year: 2082,
    month: 2, // Ashar (June/July)
    day: 5
  };
};

export const convertToEnglishDate = (nepaliDate: NepaliDate): Date => {
  const mapping = monthStartMapping[nepaliDate.year.toString()];
  if (!mapping || !mapping[nepaliDate.month]) {
    throw new Error('Invalid Nepali date');
  }

  const monthStart = mapping[nepaliDate.month];
  const date = new Date(monthStart.year, monthStart.month, monthStart.day);
  date.setDate(date.getDate() + nepaliDate.day - 1);
  
  return date;
};

export const getDaysInMonth = (year: number, month: number): number => {
  if (daysInMonthNepali[year]) {
    return daysInMonthNepali[year][month];
  }
  return 30; // Default fallback
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  const mapping = monthStartMapping[year.toString()];
  if (!mapping || !mapping[month]) {
    return 0; // Default to Sunday
  }

  const startDate = new Date(mapping[month].year, mapping[month].month, mapping[month].day);
  return startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const isValidNepaliDate = (date: NepaliDate): boolean => {
  if (!daysInMonthNepali[date.year]) {
    return false;
  }

  const daysInMonth = getDaysInMonth(date.year, date.month);
  return date.day >= 1 && date.day <= daysInMonth;
};

export const formatNepaliDate = (date: NepaliDate): string => {
  const nepaliMonths = [
    'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
  ];
  
  return `${date.day} ${nepaliMonths[date.month]} ${date.year}`;
};

export const isToday = (nepaliDate: NepaliDate, today: NepaliDate): boolean => {
  return (
    nepaliDate.year === today.year &&
    nepaliDate.month === today.month &&
    nepaliDate.day === today.day
  );
};

// Debug function to help identify date conversion issues
export const debugDateConversion = () => {
  const today = new Date();
  console.log('=== DATE CONVERSION DEBUG ===');
  console.log('Current English Date:', today.toDateString());
  console.log('Year:', today.getFullYear(), 'Month:', today.getMonth(), 'Day:', today.getDate());
  
  const nepaliToday = findCurrentNepaliDate(today);
  console.log('Converted Nepali Date:', nepaliToday);
  console.log('Formatted Nepali Date:', formatNepaliDate(nepaliToday));
  
  // Check the month mapping for current date
  const mapping = monthStartMapping[nepaliToday.year.toString()];
  if (mapping && mapping[nepaliToday.month]) {
    const monthStart = mapping[nepaliToday.month];
    const monthStartDate = new Date(monthStart.year, monthStart.month, monthStart.day);
    console.log('Current Nepali month starts on:', monthStartDate.toDateString());
    console.log('Days since month start:', Math.floor((today.getTime() - monthStartDate.getTime()) / (1000 * 60 * 60 * 24)));
  }
  
  // Test conversion back
  try {
    const backToEnglish = convertToEnglishDate(nepaliToday);
    console.log('Converted back to English:', backToEnglish.toDateString());
    console.log('Date difference (days):', Math.floor((today.getTime() - backToEnglish.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Check if they match
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const backNormalized = new Date(backToEnglish.getFullYear(), backToEnglish.getMonth(), backToEnglish.getDate());
    console.log('Dates match:', todayNormalized.getTime() === backNormalized.getTime());
  } catch (error) {
    console.error('Error converting back to English:', error);
  }
  console.log('=== END DEBUG ===');
};