import React, { useEffect, useState } from "react";
import { fetchMainPageStats } from "../services/additional";

interface StatsData {
  total_books?: number;
  active_users?: number;
  category_counts?: number;
  [key: string]: any; // Catch-all for other expected backend fields explicitly permitted
}

/**
 * StatsBar Component
 * Responsibility: Render horizontal stats bar
 */
export default function StatsBar() {
  const [mainPageStats, setMainPageStats] = useState<StatsData>({});
  
  useEffect(() => {
    let isMounted = false;

    if (!isMounted) {
      // Assuming fetchMainPageStats resolves to something matching `StatsData`
      fetchMainPageStats().then((data: any) => {
        if (!isMounted) setMainPageStats(data);
      });
    }

    return () => {
      isMounted = true;
    };
  }, []);

  return (
    <section className="bg-[#123a7b] py-10">
      <div className="custom-container grid grid-cols-2 gap-6 text-center text-white sm:grid-cols-4">
        <div>
          <p className="text-2xl font-bold text-red-200 sm:text-3xl">
            {mainPageStats.total_books || 0}
          </p>
          <p className="text-xs uppercase tracking-wide text-blue-100">
            Kitoblar
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-red-200 sm:text-3xl">
            {mainPageStats.active_users || 0}
          </p>
          <p className="text-xs uppercase tracking-wide text-blue-100">
            Aktiv foydalanuvchilar
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-red-200 sm:text-3xl">
            {mainPageStats.category_counts || 0}
          </p>
          <p className="text-xs uppercase tracking-wide text-blue-100">
            Kategoriyalar soni
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-red-200 sm:text-3xl">24/4</p>
          <p className="text-xs uppercase tracking-wide text-blue-100">
            Xizmat vaqti
          </p>
        </div>
      </div>
    </section>
  );
}
