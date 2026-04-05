import React from 'react';

interface SectionHeaderProps {
  title: string;
  action?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  actionLabel?: string;
}

/**
 * SectionHeader Component
 * Responsibility: Render section title and optional action button
 */
export default function SectionHeader({ title, action, actionLabel = "Barchasi" }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-xl font-semibold text-[#1a478e]">{title}</h2>
      {actionLabel && (
        <button onClick={action} className="text-sm font-semibold text-[#1a478e] hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
