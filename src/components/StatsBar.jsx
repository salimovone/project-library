import {useEffect, useState} from "react";
import {fetchMainPageStats} from "../services/additional";

/**
 * StatsBar Component
 * Responsibility: Render horizontal stats bar
 */
export default function StatsBar() {
	const [mainPageStats, setMainPageStats] = useState({});
	let isMounted = false;
	useEffect(() => {
		if (isMounted) return;

		fetchMainPageStats().then(setMainPageStats);

		return () => {
			isMounted = true;
		};
	}, []);
	return (
		<section className="bg-[#123a7b] dark:bg-[#0a1e3f] py-10 transition-colors duration-300">
			<div className="custom-container grid grid-cols-2 gap-6 text-center text-white sm:grid-cols-4">
				<div>
					<p className="text-2xl font-bold text-red-200 sm:text-3xl">
						{mainPageStats.total_books}
					</p>
					<p className="text-xs uppercase tracking-wide text-blue-100">
						Kitoblar
					</p>
				</div>

				<div>
					<p className="text-2xl font-bold text-red-200 sm:text-3xl">
						{mainPageStats.active_users}
					</p>
					<p className="text-xs uppercase tracking-wide text-blue-100">
						Aktiv foydalanuvchilar
					</p>
				</div>

				<div>
					<p className="text-2xl font-bold text-red-200 sm:text-3xl">
						{mainPageStats.category_counts}
					</p>
					<p className="text-xs uppercase tracking-wide text-blue-100">
						Kategoriyalar soni
					</p>
				</div>

				<div>
					<p className="text-2xl font-bold text-red-200 sm:text-3xl">24/7</p>
					<p className="text-xs uppercase tracking-wide text-blue-100">
						Xizmat vaqti
					</p>
				</div>
			</div>
		</section>
	);
}
