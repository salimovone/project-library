export function StatsCard({stat, value}) {
	return (
		<div className="flex flex-col justify-center rounded-2xl bg-white dark:bg-[#1e1e1e] p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 transition-colors hover:-translate-y-1 duration-300">
			{stat.icon}
			<p className="text-[28px] font-bold text-[#143c7b] dark:text-blue-300 leading-none transition-colors">
				{value}
			</p>
			<p className="mt-2 text-sm font-medium text-[#5174ac] dark:text-blue-400 transition-colors">{stat.label}</p>
		</div>
	);
}
