// app/api/calendar-data/[years]/[months]/route.ts
import { NextResponse } from 'next/server';
import calendarData from '@/calendardata/nepali_calendar_data.json';

interface CalendarError {
  error: string;
  status: number;
}

interface MonthData {
  index: number;
  total_days: number;
  start_day_of_week: number;
  is_leap_month: boolean;
  data: Array<{
    nepali_date: string;
    english_date: string;
    tithi: string;
    festival: string;
    holiday: boolean;
    marriage_date: boolean;
    bratabandha: boolean;
  }>;
  first_day_english?: {
    english_date: number;
    english_month: string;
  };
  error?: string;
}

interface YearData {
  months: MonthData[];
  year_info: {
    total_days: number;
    has_leap_month: boolean;
  };
}

function validateParams(year: string, month: number): CalendarError | null {
  const yearNum = parseInt(year);
  
  // Validate year
  if (isNaN(yearNum) || yearNum < 2081 || yearNum > 2085) {
    return {
      error: 'Year must be between 2081 and 2085',
      status: 400
    };
  }

  // Validate month
  if (isNaN(month) || month < 0 || month > 11) {
    return {
      error: 'Month must be between 0 and 11',
      status: 400
    };
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ years: string; months: string }> }
) {
  try {
    // Await params before destructuring
    const { years: year, months } = await params;
    const monthIndex = parseInt(months);

    // Validate parameters
    const validationError = validateParams(year, monthIndex);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: validationError.status }
      );
    }

    // Get year data
    const yearData = (calendarData as Record<string, YearData>)[year];
    if (!yearData) {
      return NextResponse.json(
        { error: `Data not found for year ${year}` },
        { status: 404 }
      );
    }

    // Get month data
    const monthData = yearData.months[monthIndex];
    if (!monthData) {
      return NextResponse.json(
        { error: `Data not found for month ${monthIndex}` },
        { status: 404 }
      );
    }

    // Check if month has error
    if (monthData.error) {
      return NextResponse.json(
        { error: `Error in month data: ${monthData.error}` },
        { status: 500 }
      );
    }

    // Format response
    const response = {
      data: monthData.data,
      info: {
        year: parseInt(year),
        month: monthIndex,
        total_days: monthData.total_days,
        start_day_of_week: monthData.start_day_of_week,
        is_leap_month: monthData.is_leap_month,
        first_day_english: monthData.first_day_english,
        year_info: yearData.year_info
      },
      meta: {
        has_errors: false,
        data_available: monthData.data.length > 0
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load calendar data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add additional endpoints for more functionality
export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ years: string; months: string }> }
) {
  const { years: year, months } = await params;
  const monthIndex = parseInt(months);

  const validationError = validateParams(year, monthIndex);
  if (validationError) {
    return new Response(null, { status: validationError.status });
  }

  const yearData = (calendarData as Record<string, YearData>)[year];
  const monthData = yearData?.months[monthIndex];

  if (!yearData || !monthData) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, { status: 200 });
}