import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function BookDetailsPanel({ book, commentCount }) {

	const pubDate = book.published_date
		&& new Date(book.published_date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})

	const normalizedRating =
		book.rating > 5 ? (book.rating / 2).toFixed(1) : book.rating?.toFixed(1) || "0.0";

	const quantity = book.quantity ?? 0;
	const isAvailable = quantity > 0;

	return (
		<div className="relative w-full mx-auto rounded-3xl bg-white dark:bg-[#1e1e1e] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 transition-colors duration-300">
			{/* Quantity Badge */}
			<div className={`absolute top-6 right-6 md:top-8 md:right-8 px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm ${isAvailable ? "bg-green-500" : "bg-red-500"}`}>
				Kitob soni: {quantity}
			</div>

			<div className="mb-6 pr-32">
				<h1 className="text-4xl font-medium text-[#003366] dark:text-blue-300 mb-3 tracking-tight leading-snug transition-colors">
					{book?.name}
				</h1>
				<p className="text-xl text-[#4a90e2] font-medium">
					by {book.author?.[0]?.name}
				</p>
			</div>

			<div className="flex items-center gap-2 mb-6">
				<div className="flex text-[#e63946] text-lg">
					{Array.from({ length: 5 }).map((_, index) => {
						const step = index + 1;
						if (normalizedRating >= step) {
							return <FaStar key={index} />;
						} else if (normalizedRating > index && normalizedRating < step) {
							return <FaStarHalfAlt key={index} />;
						} else {
							return <FaRegStar key={index} className="text-gray-300 dark:text-gray-600" />;
						}
					})}
				</div>
				<span className="text-[#1a478e] dark:text-blue-400 font-bold text-xl ml-1 transition-colors">
					{normalizedRating}
				</span>
				<span className="text-[#4a90e2] dark:text-blue-500 text-xl ml-2 transition-colors">({commentCount} izohlar)</span>
			</div>

			<hr className="border-t-2 border-[#1a478e]/20 dark:border-gray-700 mb-10 transition-colors" />

			<div className="mb-10">
				<h2 className="text-xl font-extrabold text-black dark:text-white mb-6 transition-colors">Kitob ma'lumotlari</h2>
				<div className="grid grid-cols-2 gap-x-12 gap-y-5">
					<div className="flex justify-between items-center">
						<span className="text-gray-500 dark:text-gray-400 font-medium transition-colors">Format:</span>
						<span className="font-bold text-gray-800 dark:text-gray-200 transition-colors">{book.is_physical ? "Qattiq jild" : "Digital"}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 dark:text-gray-400 font-medium transition-colors">Pages:</span>
						<span className="font-bold text-gray-800 dark:text-gray-200 transition-colors">{book.pages ? book.pages : "noma'lum"}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 dark:text-gray-400 font-medium transition-colors">ISBN-13:</span>
						<span className="font-bold text-gray-800 dark:text-gray-200 transition-colors">
							{book.isbn}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 dark:text-gray-400 font-medium transition-colors">Publication Date:</span>
						<span className="font-bold text-gray-800 dark:text-gray-200 transition-colors">{pubDate}</span>
					</div>
				</div>
			</div>

			<hr className="border-t-2 border-[#1a478e]/20 dark:border-gray-700 mb-10 transition-colors" />

			{/* About Section */}
			<div className="mb-8">
				<h2 className="text-xl font-extrabold text-black dark:text-white mb-6 transition-colors">
					About This Book
				</h2>
				<div className="text-[17px] text-gray-600 dark:text-gray-300 leading-[1.6] space-y-6 transition-colors">
					{book.description}
				</div>
			</div>

			{/* Tags (Kategoriyalar) */}
			<div className="flex flex-wrap gap-3 mt-10">
				{book.tags?.map(tag => (
					<span
						key={tag.id}
						className="px-5 py-2 rounded-full bg-[#eef2ff] dark:bg-indigo-900/30 text-[#6366f1] dark:text-indigo-300 text-sm font-semibold hover:bg-[#e0e7ff] dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
					>
						{tag.name}
					</span>
				))}
			</div>
		</div>
	);
}
