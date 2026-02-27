import {useEffect, useState} from "react";
import {FaStar, FaHeadphones, FaBookmark, FaDownload} from "react-icons/fa";
import {fetchBook} from "../services/bookService";
import {useParams} from "react-router";
import {fetchComments} from "../services/commentService";
import { formatDateReadable } from "../utils/helper";

const mockReviews = [
	{
		id: 1,
		name: "Sarah Johnson",
		time: "2 days ago",
		rating: 5,
		title: "Life-changing read!",
		text: "This book absolutely blew me away.",
	},
	{
		id: 2,
		name: "Michael Chen",
		time: "1 week ago",
		rating: 4,
		title: "Beautiful and thought-provoking",
		text: "A beautiful exploration of regret...",
	},
];

const reviewStats = [
	{label: "5 star", value: 75},
	{label: "4 star", value: 15},
	{label: "3 star", value: 6},
	{label: "2 star", value: 3},
	{label: "1 star", value: 1},
];

// 1. KITOB MUQOVASI VA HARAKATLAR TUGMASI
function BookCoverCard({book}) {
	const fallbackImg = "https://via.placeholder.com/300x450?text=Kitob+Muqovasi";
	const imageUrl = book.img ? book.img : fallbackImg;

	// -- BO'SH FUNKSIYALAR --
	const handleDownload = () => {
		/* Kitobni yuklab olish logikasi */ console.log("Yuklanmoqda...");
	};
	const handleListen = () => {
		/* Audio formatga o'tish logikasi */ console.log("Audio yoqilmoqda...");
	};
	const handleBookmark = () => {
		/* Kutubxonaga saqlash logikasi */ console.log("Saqlandi!");
	};

	return (
		<div className="rounded-2xl bg-white h-full p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)] self-start sticky top-24">
			<img
				src={imageUrl}
				alt={book.name}
				className="h-100 w-full rounded-2xl object-cover shadow-sm"
			/>
			<div className="mt-6 space-y-3">
				{book.is_available && (
					<button
						onClick={handleDownload}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 font-semibold text-white transition hover:bg-orange-500"
					>
						<FaDownload /> Yuklab olish
					</button>
				)}
				<button
					onClick={handleListen}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700"
				>
					<FaHeadphones /> Audioni tinglash
				</button>
				<button
					onClick={handleBookmark}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
				>
					<FaBookmark /> Band qilish
				</button>
			</div>
		</div>
	);
}

// 2. KITOBNING ASOSIY MA'LUMOTLARI PANEL
function BookDetailsPanel({book}) {
	// Sanani chiroyli formatlash
	const pubDate = book.c_at
		? new Date(book.c_at).toLocaleDateString("uz-UZ", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "Mavjud emas";

	// Reytingni 5 yulduzlik sistemaga tushirish (agar 10 ballik bo'lsa, 2 ga bo'lamiz)
	const normalizedRating =
		book.rating > 5 ? (book.rating / 2).toFixed(1) : book.rating;

	return (
		<div className="rounded-2xl bg-white p-6 md:p-8 max-lg:mt-16 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
			<div className="flex justify-between items-start gap-4">
				<div>
					<h1 className="text-3xl font-bold text-[#1a478e] leading-tight">
						{book.name}
					</h1>
					<p className="text-base text-gray-500 mt-1 font-medium">
						by {book.author}
					</p>
				</div>

				{/* Omborda bor/yo'qligi */}
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${book.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
				>
					{book.quantity > 0 ? `Omborda: ${book.quantity} ta` : "Qolmagan"}
				</span>
			</div>

			<div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
				<div className="flex text-yellow-500">
					{Array.from({length: 5}).map((_, index) => (
						<FaStar
							key={index}
							className={
								index < Math.floor(normalizedRating)
									? "text-yellow-400"
									: "text-gray-300"
							}
						/>
					))}
				</div>
				<span className="font-bold text-[#1a478e] text-base">
					{normalizedRating}
				</span>
				<span>({book.is_frequent ? "Ko'p o'qilgan" : "Yangi"})</span>
			</div>

			{/* Detallar Jadvali */}
			<div className="mt-8 border-t border-gray-100 pt-6">
				<h2 className="text-base font-bold text-[#143c7b] mb-4">
					Kitob tafsilotlari
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
					<div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
						<p className="text-gray-500 mb-1">Kategoriya:</p>
						<p className="font-semibold text-gray-800 capitalize">
							{book.category?.name || "N/A"}
						</p>
					</div>
					<div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
						<p className="text-gray-500 mb-1">ISBN:</p>
						<p className="font-semibold text-gray-800">{book.isbn || "N/A"}</p>
					</div>
					<div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
						<p className="text-gray-500 mb-1">Nashr sanasi:</p>
						<p className="font-semibold text-gray-800">{pubDate}</p>
					</div>
					<div className="flex justify-between sm:block">
						<p className="text-gray-500 mb-1">Kitobxon:</p>
						<p className="font-semibold text-gray-800">
							{book.reader?.first_name} {book.reader?.last_name}
						</p>
					</div>
				</div>
			</div>

			{/* Description / About */}
			<div className="mt-8 border-t border-gray-100 pt-6">
				<h2 className="text-base font-bold text-[#143c7b] mb-3">
					Kitob haqida
				</h2>
				<div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
					{book.description || "Ma'lumot kiritilmagan..."}
				</div>

				{/* Teglar */}
				{book.tags && book.tags.length > 0 && (
					<div className="mt-6 flex flex-wrap gap-2">
						{book.tags.map(tag => (
							<span
								key={tag.id}
								className="rounded-md bg-[#edf2f7] px-3 py-1.5 text-xs font-semibold text-[#1a478e] capitalize hover:bg-blue-100 cursor-pointer transition"
							>
								#{tag.name}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// 3. REYTING STATISTIKASI (Hozircha static)
function ReviewSummary() {
	const handleWriteReview = () => {
		/* Sharh yozish modalini ochish */ console.log("Sharh oynasi...");
	};

	return (
		<div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-center">
				<div className="flex-1 text-center lg:text-left">
					<h3 className="text-base font-bold text-[#143c7b]">
						Mijozlar bahosi
					</h3>
					<p className="mt-2 text-5xl font-bold text-[#1a478e]">4.5</p>
					<p className="text-sm text-gray-500 mt-1">2,847 ta sharh asosida</p>
				</div>
				<div className="flex-1 space-y-2.5">
					{reviewStats.map((stat, idx) => (
						<div key={idx} className="flex items-center gap-3">
							<span className="w-12 text-xs font-medium text-gray-600">
								{stat.label}
							</span>
							<div className="h-2.5 flex-1 rounded-full bg-gray-100">
								<div
									className="h-2.5 rounded-full bg-yellow-400"
									style={{width: `${stat.value}%`}}
								/>
							</div>
							<span className="w-10 text-xs font-medium text-gray-600">
								{stat.value}%
							</span>
						</div>
					))}
				</div>
				<button
					onClick={handleWriteReview}
					className="w-full lg:w-auto self-start rounded-xl bg-[#003282] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
				>
					Sharh qoldirish
				</button>
			</div>
		</div>
	);
}

// commentlar ro'yxati
function ReviewList() {
	const [comments, setComments] = useState({});
	const {id} = useParams();
	let isMounted = false;
	useEffect(() => {
		if (isMounted) return;
		fetchComments(id).then(setComments);
		return () => {
			isMounted = true;
		};
	}, []);
	const handleLoadMore = () => {
		/* Keyingi sharhlarni yuklash */ console.log("Yana sharhlar...");
	};

	return (
		comments.results &&
		comments.results.length > 0 && (
			<div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
				<h3 className="text-base font-bold text-[#143c7b] mb-4">
					Oxirgi sharhlar
				</h3>
				<div className="space-y-6">
					{comments.results.map(review => (
						<div
							key={review.id}
							className="border-b border-gray-100 pb-6 last:border-none last:pb-0"
						>
							<div className="flex items-center justify-between mb-2">
								<div>
									<p className="text-sm font-bold text-gray-800">
										{/* {review.name} */}
                    John Doe
									</p>
									<p className="text-xs text-gray-400 font-medium">
										{formatDateReadable(review.c_at)}
									</p>
								</div>
								<div className="flex text-yellow-400 text-sm">
									{Array.from({length: review.rating}).map((_, index) => (
										<FaStar key={index} />
									))}
								</div>
							</div>
							<h4 className="text-sm font-semibold text-gray-800">
								{/* {review.title} */}
                  comment title
							</h4>
							<p className="mt-1 text-sm text-gray-600 leading-relaxed">
								{review.content}
							</p>
						</div>
					))}
				</div>
				{comments.next && (
					<button
						onClick={handleLoadMore}
						className="mt-6 w-full cursor-pointer text-sm font-semibold text-[#1a478e] hover:text-blue-800 transition"
					>
						Yana sharhlarni yuklash...
					</button>
				)}
			</div>
		)
	);
}

/**
 * ASOSIY SAHIFA: BookDetailPage
 */
export default function BookDetailPage() {
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const {id} = useParams();

	useEffect(() => {
		setLoading(true);
		fetchBook(id).then(setBook);
		setLoading(false);
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-[#1a478e] font-semibold">
				Yuklanmoqda...
			</div>
		);
	}

	if (!book) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
				Kitob topilmadi.
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f8f9fa] py-8 font-sans">
			<div className="custom-container mx-auto px-4 md:px-6 space-y-8">
				{/* Yuqori qism: Rasm va Ma'lumotlar */}
				<div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
					<BookCoverCard book={book} />
					<BookDetailsPanel book={book} />
				</div>

				{/* Pastki qism: Sharhlar va Reytinglar (max-w cheklovi olib tashlandi) */}
				<div className="space-y-6 w-full">
					<ReviewSummary />
					<ReviewList />
				</div>
			</div>
		</div>
	);
}
