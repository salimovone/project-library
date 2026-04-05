import {TargetIcon} from "./Icons";

export function GoalProgress({hideProgress}) {
	if (hideProgress) return null;
	return (
		<div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col gap-5 mt-6">
			<div className="flex justify-between items-end">
				<div className="flex items-center gap-3">
					<TargetIcon />
					<div>
						<h3 className="text-lg font-bold text-[#143c7b] leading-tight">
							O'qish maqsadi 2026
						</h3>
						<p className="text-[13px] font-medium text-[#5174ac] mt-0.5">
							52 kitobdan 47 tasi
						</p>
					</div>
				</div>
				<div className="text-right">
					<p className="text-lg font-bold text-[#143c7b] leading-tight">90 %</p>
					<p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
						Bajarildi
					</p>
				</div>
			</div>

			{/* Progress Line */}
			<div className="w-full bg-[#edf2f7] rounded-full h-2.5 overflow-hidden">
				<div
					className="bg-[#143c7b] h-2.5 rounded-full transition-all duration-1000"
					style={{width: "90%"}}
				></div>
			</div>

			<p className="text-sm font-medium text-[#5174ac]">
				Siz muddatdan 3 ta kitob oldindasiz!
			</p>
		</div>
	);
}
