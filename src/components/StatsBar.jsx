import { useEffect, useState } from "react";
import { fetchMainPageStats } from "../services/additional";

/**
 * StatsBar Component
 * Responsibility: Render main stats bar according to design specs
 */
export default function StatsBar() {
  const [mainPageStats, setMainPageStats] = useState({
    total_books: "12 480",
    active_users: "6 214",
    category_counts: "14",
  });

  useEffect(() => {
    let isMounted = true;
    fetchMainPageStats()
      .then((data) => {
        if (isMounted && data) {
          setMainPageStats((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error("Stats error:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { value: mainPageStats.total_books || "12 480", label: "Kitoblar" },
    { value: mainPageStats.active_users || "6 214", label: "Aktiv foydalanuvchi" },
    { value: mainPageStats.category_counts || "14", label: "Kategoriya" },
    { value: "24/7", label: "Xizmat vaqti" },
  ];

  return (
    <section className="bg-[#eef3fb] dark:bg-[#0b1730] border-t border-[#e0e6f2] dark:border-[#1e2c4b] py-10 transition-colors duration-300 font-interface">
      <div className="max-w-[1320px] mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <span className="font-editorial text-3xl md:text-4xl font-normal text-[var(--navy-primary)] dark:text-white leading-none block">
              {s.value}
            </span>
            <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#5f6b85] dark:text-[#7d8ba6] block">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
