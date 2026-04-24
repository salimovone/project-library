import {TargetIcon} from "./Icons";

export function GoalProgress({hideProgress}) {
	if (hideProgress) return null;
	return (
		<div className="rounded-2xl bg-white dark:bg-[#1e1e1e] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-5 mt-6 transition-colors duration-300">
			<div className="flex justify-between items-end">
				<div className="flex items-center gap-3">
					<TargetIcon />
					<div>
						<h3 className="text-lg font-bold text-[#143c7b] dark:text-blue-300 leading-tight transition-colors">
							O'qish maqsadi 2026
						</h3>
						<p className="text-[13px] font-medium text-[#5174ac] dark:text-blue-400 mt-0.5 transition-colors">
							52 kitobdan 47 tasi
						</p>
					</div>
				</div>
				<div className="text-right">
					<p className="text-lg font-bold text-[#143c7b] dark:text-blue-300 leading-tight transition-colors">90 %</p>
					<p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide transition-colors">
						Bajarildi
					</p>
				</div>
			</div>

			{/* Progress Line */}
			<div className="w-full bg-[#edf2f7] dark:bg-gray-800 rounded-full h-2.5 overflow-hidden transition-colors">
				<div
					className="bg-[#143c7b] dark:bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
					style={{width: "90%"}}
				></div>
			</div>

			<p className="text-sm font-medium text-[#5174ac] dark:text-blue-400 transition-colors">
				Siz muddatdan 3 ta kitob oldindasiz!
			</p>
		</div>
	);
}
