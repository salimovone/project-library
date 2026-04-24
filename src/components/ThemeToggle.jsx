import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full transition-colors duration-500 flex items-center justify-between px-1 shadow-inner
        ${isDark ? 'bg-slate-800' : 'bg-sky-200'}`}
      aria-label="Toggle Dark Mode"
    >
      {/* Background Icons */}
      <span className="text-yellow-500 text-sm ml-0.5">
        <MdOutlineLightMode />
      </span>
      <span className="text-blue-300 text-sm mr-0.5">
        <MdOutlineDarkMode />
      </span>

      {/* Sliding Circle */}
      <div 
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transition-transform duration-500 ease-in-out
          ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {isDark ? (
           <MdOutlineDarkMode className="text-slate-800 text-xs" />
        ) : (
           <MdOutlineLightMode className="text-sky-500 text-xs" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
