import { useNavigate } from "react-router";

export default function ReadingProgressWidget({ className = "" }) {
  const navigate = useNavigate();

  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5.5 shadow-sm flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold tracking-widest uppercase text-[var(--text-subtle)]">
          Davom ettirish
        </span>
        <button
          onClick={() => navigate("/profile")}
          className="text-xs font-bold text-[var(--navy-primary)] dark:text-blue-400 hover:underline cursor-pointer"
        >
          Barchasi
        </button>
      </div>

      <div className="flex gap-3.5 items-center">
        <span className="w-16 h-22 rounded-xl bg-gradient-to-br from-[#4a7fc9] to-[#2a538f] shrink-0 relative overflow-hidden block">
          <span className="absolute left-0 top-0 bottom-0 w-1.2 bg-[var(--crimson-primary)]" />
        </span>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-sm font-bold text-[var(--text-main)] leading-snug truncate">
            Odam anatomiyasi
          </span>
          <span className="text-xs text-[var(--text-subtle)]">
            A. G'. Ahmedov · 233-bet / 444
          </span>
          <div className="h-1.5 rounded-full bg-[#f0eee9] dark:bg-[#1a2540] relative overflow-hidden">
            <span className="absolute left-0 top-0 bottom-0 w-[52%] bg-[#5fd28a] rounded-full" />
          </div>
          <button
            onClick={() => navigate("/books/1")}
            className="self-start mt-1 h-8 px-3.5 rounded-lg bg-[var(--navy-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
          >
            O'qishni davom ettirish
          </button>
        </div>
      </div>

      <div className="h-px bg-[var(--border-main)]" />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-3">
          <span className="text-xl font-extrabold text-[var(--text-main)] block leading-none">2</span>
          <span className="text-[11.5px] text-[var(--text-subtle)] font-semibold mt-1 block">Band qilingan</span>
        </div>
        <div className="bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-3">
          <span className="text-xl font-extrabold text-[#a8760c] block leading-none">3 kun</span>
          <span className="text-[11.5px] text-[var(--text-subtle)] font-semibold mt-1 block">Qaytarish muddati</span>
        </div>
      </div>
    </div>
  );
}
