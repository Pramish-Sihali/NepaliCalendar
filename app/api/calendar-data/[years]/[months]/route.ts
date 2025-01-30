// app/api/calendar-data/[years]/[months]/route.ts
import { NextResponse } from 'next/server';

// Updated days per month for 2081 (correct values)
const daysInMonth2081 = {
  baisakh: 31,
  jestha: 32,
  ashad: 31,
  shrawan: 32,
  bhadra: 31,
  ashwin: 31,
  kartik: 30,
  mangsir: 30,
  poush: 30,
  magh: 30,
  falgun: 30,
  chaitra: 30
};

// Updated start days for 2081 (Sunday = 0)
const startDays2081 = {
  baisakh: 6,    // Sunday
  jestha: 2,     // Wednesday
  ashad: 6,      // Saturday
  shrawan: 2,    // Tuesday
  bhadra: 6,     // Friday
  ashwin: 2,     // Monday
  kartik: 4,     // Wednesday
  mangsir: 6,    // Friday
  poush: 1,      // Sunday
  magh: 2,       // Wednesday
  falgun: 4,     // Friday
  chaitra: 5     // Sunday
};



const monthNames = [
  'baisakh', 'jestha', 'ashad', 'shrawan', 'bhadra', 'ashwin',
  'kartik', 'mangsir', 'poush', 'magh', 'falgun', 'chaitra'
];

export async function GET(
  request: Request,
  { params }: { params: { years: string; months: string } }
) {
  try {
    const { years, months } = params;
    const monthIndex = parseInt(months);
    const monthName = monthNames[monthIndex];
    
    // Get the correct number of days and start day for this month
    const totalDays = daysInMonth2081[monthName as keyof typeof daysInMonth2081];
    const startDay = startDays2081[monthName as keyof typeof startDays2081];
    
    // Generate calendar data with correct English date mapping
    const data = Array.from({ length: totalDays }, (_, i) => {
      const nepaliDay = i + 1;
      let englishDate;
      
      // Updated English date calculation based on month
      if (monthIndex === 1) { // Jestha
        englishDate = nepaliDay <= 18 ? nepaliDay + 13 : nepaliDay - 18;
      } else {
        englishDate = nepaliDay <= 15 ? nepaliDay + 13 : nepaliDay - 17;
      }

      return {
        nepali_date: String(nepaliDay),
        english_date: String(englishDate),
        tithi: "",
        festival: "",
        holiday: false,
        marriage_date: false,
        bratabandha: false,
        day_of_week: (startDay + i) % 7
      };
    });

    const monthInfo = {
      year: parseInt(years),
      month: monthIndex,
      month_name: monthName,
      total_days: totalDays,
      start_day_of_week: startDay,
      is_leap_month: totalDays > 31
    };

    return NextResponse.json({
      data,
      info: monthInfo
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load calendar data' },
      { status: 500 }
    );
  }
}