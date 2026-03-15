export function StatsCard({stat, value}) {
	return (
		<div className="flex flex-col justify-center rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100 transition hover:-translate-y-1">
			{stat.icon}
			<p className="text-[28px] font-bold text-[#143c7b] leading-none">
				{value}
			</p>
			<p className="mt-2 text-sm font-medium text-[#5174ac]">{stat.label}</p>
		</div>
	);
}
