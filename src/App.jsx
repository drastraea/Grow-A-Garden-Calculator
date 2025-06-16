import { useState, useEffect } from 'react';
import GrowCalculator from "./GaGCalc";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  

  return (
    <div className="min-h-screen light:bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="flex justify-between items-center p-4 max-w-xl mx-auto">
        <h1 className="text-xl font-bold">Grow a Garden Calculator</h1>
        <button
          onClick={() => setIsDark(prev => !prev)}
          className="px-4 py-1 border rounded dark:border-white border-black"
        >
          {isDark ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <GrowCalculator />
    </div>
  );
}
