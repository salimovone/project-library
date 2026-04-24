import { Link } from "react-router";

export default function NewArrivalCard({ book }) {
	const imageUrl = book.img;

	const icons = [];

	if (book.is_physical) {
		icons.push(
			<svg
				key="phys"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-4.5 w-4.5 text-[#1a56db]"
			>
				<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
				<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
			</svg>,
		);
	}

	if (book.has_audio) {
		icons.push(
			<svg
				key="audio"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-4.5 w-4.5 text-[#e02424]"
			>
				<path d="M3 18v-6a9 9 0 0 1 18 0v6" />
				<path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
			</svg>,
		);
	}

	if (book.has_pdf) {
		icons.push(
			<svg
				key="pdf"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-4.5 w-4.5 text-[#ff7b42]"
			>
				<rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
				<line x1="12" x2="12.01" y1="18" y2="18" />
			</svg>,
		);
	}

	return (
		<Link
			to={`/books/${book.id}`}
			className="group flex flex-col h-full overflow-hidden rounded-[20px] bg-white dark:bg-[#1e1e1e] shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:shadow-none transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:hover:bg-[#252525] hover:-translate-y-1.5 border border-transparent dark:border-gray-800"
		>
			<div className="relative w-full aspect-3/4 overflow-hidden bg-gray-50 dark:bg-[#2a2a2a] p-2 transition-colors duration-300">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={book?.name}
						className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="h-full w-full rounded-xl bg-linear-to-br from-[#003366] to-[#1a478e] p-3 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
						<div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse bg-repeat"></div>
						<h3 className="text-[24px] font-bold text-white mb-2 line-clamp-3 leading-snug relative z-10 px-1 drop-shadow-sm">{book?.name}</h3>
						<div className="h-0.5 w-6 bg-blue-400 rounded-full mb-1.5 relative z-10"></div>
						<p className="text-blue-200 text-xs font-medium leading-snug relative z-10 line-clamp-2">{book?.author?.[0]?.name || "Noma'lum"}</p>
					</div>
				)}
			</div>

			<div className="flex flex-col grow p-4 pt-2">
				<h3
					className="text-[15px] font-bold text-[#1e293b] dark:text-gray-100 line-clamp-1 mb-0.5 transition-colors duration-300"
					title={book?.name}
				>
					{book?.name}
				</h3>

				<div className="flex flex-wrap gap-1">
					{book.author &&
						book.author.map((author, idx) => (
							<span
								key={idx + 1}
								className="text-[13px] text-gray-400 font-medium"
							>
								{author?.name}
								{idx < book.author.length - 1 ? "," : ""}
							</span>
						))}
				</div>

				<div className="mt-auto pt-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						{icons.map((icon, index) => (
							<div key={index} className="flex items-center gap-2">
								{icon}
								{index < icons.length - 1 && (
									<div className="h-3 w-[1.5px] bg-gray-300 dark:bg-gray-600 rounded-full" />
								)}
							</div>
						))}
					</div>

					<div className="flex items-center gap-1.5 rounded-xl bg-[#FFFBEB] dark:bg-yellow-900/20 px-3 py-1.5 border border-[#FEF3C7] dark:border-yellow-700/30 transition-colors duration-300">
						<span className="text-xs font-black text-[#B45309] dark:text-yellow-500">
							{book.rating?.toFixed(1) || "0.0"}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-3.5 h-3.5 text-[#F59E0B]"
						>
							<path
								fillRule="evenodd"
								d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.218 21.416c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Link>
	);
}
