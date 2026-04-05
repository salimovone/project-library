import {FaStar, FaRegStar, FaStarHalfAlt} from "react-icons/fa";

export default function BookDetailsPanel({book}) {

	console.log("book", book)

	const pubDate = book.published_date
		&& new Date(book.published_date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})

	const normalizedRating =
		book.rating > 5 ? (book.rating / 2).toFixed(1) : book.rating?.toFixed(1) || "0.0";

	return (
		<div className="w-full mx-auto rounded-3xl bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
			<div className="mb-6">
				<h1 className="text-4xl font-medium text-[#003366] mb-3 tracking-tight">
					{book?.name}
				</h1>
				<p className="text-xl text-[#4a90e2] font-medium">
					by {book.author?.[0]?.name}
				</p>
			</div>

			<div className="flex items-center gap-2 mb-6">
				<div className="flex text-[#e63946] text-lg">
					{Array.from({length: 5}).map((_, index) => {
						const step = index + 1;
						if (normalizedRating >= step) {
							return <FaStar key={index} />;
						} else if (normalizedRating > index && normalizedRating < step) {
							return <FaStarHalfAlt key={index} />;
						} else {
							return <FaRegStar key={index} className="text-gray-300" />;
						}
					})}
				</div>
				<span className="text-[#1a478e] font-bold text-xl ml-1">
					{normalizedRating}
				</span>
				<span className="text-[#4a90e2] text-xl ml-2">(33 kommentlar)</span>
			</div>

			<hr className="border-t-2 border-[#1a478e]/20 mb-10" />

			<div className="mb-10">
				<h2 className="text-xl font-extrabold text-black mb-6">Book Details</h2>
				<div className="grid grid-cols-2 gap-x-12 gap-y-5">
					<div className="flex justify-between items-center">
						<span className="text-gray-500 font-medium">Format:</span>
						<span className="font-bold text-gray-800">{book.is_physical ? "Hardcover" : "Digital"}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 font-medium">Pages:</span>
						<span className="font-bold text-gray-800">{book.pages? book.pages : "noma'lum"}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 font-medium">Publisher:</span>
						<span className="font-bold text-gray-800">Viking</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 font-medium">Language:</span>
						<span className="font-bold text-gray-800">English</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 font-medium">ISBN-13:</span>
						<span className="font-bold text-gray-800">
							{book.isbn}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-500 font-medium">Publication Date:</span>
						<span className="font-bold text-gray-800">{pubDate}</span>
					</div>
				</div>
			</div>

			<hr className="border-t-2 border-[#1a478e]/20 mb-10" />

			{/* About Section */}
			<div className="mb-8">
				<h2 className="text-xl font-extrabold text-black mb-6">
					About This Book
				</h2>
				<div className="text-[17px] text-gray-600 leading-[1.6] space-y-6">
					{book.description}
				</div>
			</div>

			{/* Tags (Kategoriyalar) */}
			<div className="flex flex-wrap gap-3 mt-10">
				{book.tags?.map(tag => (
					<span
						key={tag.id}
						className="px-5 py-2 rounded-full bg-[#eef2ff] text-[#6366f1] text-sm font-semibold hover:bg-[#e0e7ff] transition-colors cursor-pointer"
					>
						{tag.name}
					</span>
				))}
			</div>
		</div>
	);
}
