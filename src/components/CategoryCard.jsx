import { FaBrain } from "react-icons/fa";

export default function CategoryCard({ icon, label }) {
  const hasIcon = icon && typeof icon === 'string' && icon.trim() !== 'default';

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-[#1e1e1e] p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer border border-transparent dark:border-gray-800">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2f7] dark:bg-[#252525] text-[#1a478e] dark:text-blue-400 transition-colors duration-300">
        {hasIcon ? (
          <div 
            className="flex items-center justify-center w-8 h-8 dynamic-svg-wrapper"
            dangerouslySetInnerHTML={{ __html: icon }} 
          />
        ) : (
          <FaBrain size={24} />
        )}
      </span>
      <p className="text-sm font-bold text-[#1a478e] dark:text-blue-300 leading-tight transition-colors duration-300">{label}</p>
    </div>
  );
}