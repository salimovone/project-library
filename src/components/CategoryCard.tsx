import React from 'react';
import { FaBrain } from "react-icons/fa";

interface CategoryCardProps {
  icon?: string;
  label: string;
}

export default function CategoryCard({ icon, label }: CategoryCardProps) {
  const hasIcon = icon && typeof icon === 'string' && icon.trim() !== 'default';

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 cursor-pointer">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2f7] text-[#1a478e]">
        {hasIcon ? (
          <div 
            className="flex items-center justify-center w-8 h-8 dynamic-svg-wrapper"
            dangerouslySetInnerHTML={{ __html: icon as string }} 
          />
        ) : (
          <FaBrain size={24} />
        )}
      </span>
      <p className="text-sm font-bold text-[#1a478e] leading-tight">{label}</p>
    </div>
  );
}
