'use client';

import Calendar from './components/calendar';

export default function Home() {
  const handleDateSelect = (
    englishDate: Date,
    nepaliDate: { year: number; month: number; date: number }
  ) => {
    console.log('Selected English Date:', englishDate);
    console.log('Selected Nepali Date:', nepaliDate);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          नेपाली पात्रो
        </h1>
        <Calendar onDateSelect={handleDateSelect} />
      </div>
    </main>
  );
}