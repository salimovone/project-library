/**
 * CategoryCard Component
 * Responsibility: Render interest category card
 */
export default function CategoryCard({ label, icon, category }) {
  const resolved = category && typeof category === "object" ? category : null;
  const displayLabel = resolved?.label ?? label;
  const displayIcon = resolved?.icon ?? icon;
  const labelText =
    typeof displayLabel === "string" ? displayLabel : displayLabel?.label ?? "";
  const iconNode = displayIcon ?? displayLabel?.icon ?? null;

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2f7] text-[#1a478e]">
        {iconNode}
      </span>
      <p className="text-sm font-semibold text-[#1a478e]">{labelText}</p>
    </div>
  );
}
