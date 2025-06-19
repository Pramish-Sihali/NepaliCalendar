import { DaysInMonthMap, MonthStartMap } from './types';

// Nepali month names in both Devanagari and English
export const nepaliMonths = {
  months: ["बैशाख", "जेठ", "आषाढ", "श्रावण", "भदौ", "असोज", "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत्र"],
  en: ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra']
};

// Days in each month for Nepali calendar years
export const daysInMonthNepali: DaysInMonthMap = {
  2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 32, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2083: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2084: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30]
};

// Updated month start mapping with correct dates for 2025
export const monthStartMapping: MonthStartMap = {
  "2081": [
    { year: 2024, month: 3, day: 13 },   // Baisakh starts April 13, 2024
    { year: 2024, month: 4, day: 14 },   // Jestha starts May 14, 2024
    { year: 2024, month: 5, day: 14 },   // Asar starts June 14, 2024
    { year: 2024, month: 6, day: 16 },   // Shrawan starts July 16, 2024
    { year: 2024, month: 7, day: 17 },   // Bhadra starts August 17, 2024
    { year: 2024, month: 8, day: 17 },   // Ashoj starts September 17, 2024
    { year: 2024, month: 9, day: 17 },   // Kartik starts October 17, 2024
    { year: 2024, month: 10, day: 16 },  // Mangsir starts November 16, 2024
    { year: 2024, month: 11, day: 15 },  // Poush starts December 15, 2024
    { year: 2025, month: 0, day: 14 },   // Magh starts January 14, 2025
    { year: 2025, month: 1, day: 13 },   // Falgun starts February 13, 2025
    { year: 2025, month: 2, day: 14 }    // Chaitra starts March 14, 2025
  ],
  "2082": [
    { year: 2025, month: 3, day: 13 },   // Baisakh starts April 13, 2025
    { year: 2025, month: 4, day: 14 },   // Jestha starts May 14, 2025
    { year: 2025, month: 5, day: 15 },   // Asar starts June 15, 2025 (CORRECTED)
    { year: 2025, month: 6, day: 16 },   // Shrawan starts July 16, 2025
    { year: 2025, month: 7, day: 17 },   // Bhadra starts August 17, 2025
    { year: 2025, month: 8, day: 17 },   // Ashoj starts September 17, 2025
    { year: 2025, month: 9, day: 17 },   // Kartik starts October 17, 2025
    { year: 2025, month: 10, day: 16 },  // Mangsir starts November 16, 2025
    { year: 2025, month: 11, day: 15 },  // Poush starts December 15, 2025
    { year: 2026, month: 0, day: 14 },   // Magh starts January 14, 2026
    { year: 2026, month: 1, day: 13 },   // Falgun starts February 13, 2026
    { year: 2026, month: 2, day: 14 }    // Chaitra starts March 14, 2026
  ],
  "2083": [
    { year: 2026, month: 3, day: 13 },   // Baisakh starts April 13, 2026
    { year: 2026, month: 4, day: 14 },   // Jestha starts May 14, 2026
    { year: 2026, month: 5, day: 14 },   // Asar starts June 14, 2026
    { year: 2026, month: 6, day: 16 },   // Shrawan starts July 16, 2026
    { year: 2026, month: 7, day: 17 },   // Bhadra starts August 17, 2026
    { year: 2026, month: 8, day: 17 },   // Ashoj starts September 17, 2026
    { year: 2026, month: 9, day: 17 },   // Kartik starts October 17, 2026
    { year: 2026, month: 10, day: 16 },  // Mangsir starts November 16, 2026
    { year: 2026, month: 11, day: 15 },  // Poush starts December 15, 2026
    { year: 2027, month: 0, day: 14 },   // Magh starts January 14, 2027
    { year: 2027, month: 1, day: 13 },   // Falgun starts February 13, 2027
    { year: 2027, month: 2, day: 14 }    // Chaitra starts March 14, 2027
  ]
};

// Additional constants from reference implementation
export const nepaliDays = {
  short: ["आईत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"],
  long: ["आइतवार", "सोमवार", "मंगलवार", "बुधवार", "बिहिवार", "शुक्रवार", "शनिवार"]
};

export const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const bsMonthUpperDays = [
  [30, 31],
  [31, 32],
  [31, 32],
  [31, 32],
  [31, 32],
  [30, 31],
  [29, 30],
  [29, 30],
  [29, 30],
  [29, 30],
  [29, 30],
  [30, 31]
];

export const calendarBounds = {
  minBsYear: 1970,
  maxBsYear: 2100,
  minAdDateEqBsDate: {
    ad: {
      year: 1913,
      month: 3,
      date: 13
    },
    bs: {
      year: 1970,
      month: 1,
      date: 1
    }
  }
};