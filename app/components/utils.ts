// utils.ts
import { NepaliDate, EnglishDate } from './types';
import { monthStartMapping, daysInMonthNepali } from './constants';

export const findCurrentNepaliDate = (englishDate: Date): NepaliDate => {
  const year = englishDate.getFullYear();
  const month = englishDate.getMonth();
  const day = englishDate.getDate();

  // Find the corresponding Nepali year
  let nepaliYear = 2081; // Default to 2081
  let found = false;

  Object.entries(monthStartMapping).forEach(([nyear, months]) => {
    months.forEach((m, idx) => {
      if (m.year === year && m.month === month && m.day <= day) {
        nepaliYear = parseInt(nyear);
        found = true;
      }
    });
  });

  // Find the corresponding Nepali month and day
  const mapping = monthStartMapping[nepaliYear.toString()];
  let nepaliMonth = 0;
  let nepaliDay = 1;

  for (let i = 0; i < mapping.length; i++) {
    const currentMonth = mapping[i];
    const nextMonth = mapping[i + 1];

    if (nextMonth) {
      const currentMonthStart = new Date(currentMonth.year, currentMonth.month, currentMonth.day);
      const nextMonthStart = new Date(nextMonth.year, nextMonth.month, nextMonth.day);

      if (englishDate >= currentMonthStart && englishDate < nextMonthStart) {
        nepaliMonth = i;
        const diffTime = englishDate.getTime() - currentMonthStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        nepaliDay = diffDays + 1;
        break;
      }
    }
  }

  return {
    year: nepaliYear,
    month: nepaliMonth,
    day: nepaliDay
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