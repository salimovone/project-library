import React from "react";

export default function CategoryCard({ label, code = "TB", count, onClick }) {
  // Generate 2-letter uppercase code if not provided
  const categoryCode = code || (label ? label.substring(0, 2).toUpperCase() : "TB");

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2.5 p-4 md:p-4.5 border border-[var(--border-main)] rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] hover:border-[var(--navy-primary)] transition-all duration-300 cursor-pointer group shadow-xs font-interface"
    >
      <span className="w-9.5 h-9.5 rounded-xl bg-[var(--navy-light)] text-[var(--navy-primary)] font-extrabold text-sm flex items-center justify-center group-hover:bg-[var(--navy-primary)] group-hover:text-white transition-colors">
        {categoryCode}
      </span>
      <span className="text-[13.5px] font-bold text-[var(--text-main)] leading-snug line-clamp-1">
        {label}
      </span>
      <span className="text-[11.5px] font-semibold text-[var(--text-subtle)]">
        {count ? `${count} kitob` : "Bo'lim"}
      </span>
    </div>
  );
}