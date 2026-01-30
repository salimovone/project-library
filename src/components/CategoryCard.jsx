/**
 * CategoryCard Component
 * Responsibility: Render interest category card
 */
export default function CategoryCard({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2f7]">
        {icon}
      </span>
      <p className="text-sm font-semibold text-[#1a478e]">{label}</p>
    </div>
  );
}
