import {useEffect, useState} from "react";
import {NewArrivalCard} from "../components/index.js";
import {fetchLatestBooks} from "../services/bookService.js";
import {fetchBookmarks, getMe} from "../services/userService.js";
import {fetchUserProfileStats} from "../services/additional.js";
import {
	BookIcon,
	ClockIcon,
	GoalProgress,
	HeartIcon,
	ProfileHeader,
	StatsCard,
	TrophyIcon,
} from "../components/usePage/index.js";

const stats = [
	{
		id: 1,
		label: "O'qilgan kitoblar soni",
		stat: "returned_reservations",
		icon: <BookIcon />,
	},
	{
		id: 2,
		label: "Kutilayotgan Kitoblar",
		stat: "pending_reservations",
		icon: <ClockIcon />,
	},
	{id: 3, label: "Baholangan kitoblar", stat: "ratings", icon: <TrophyIcon />},
	{id: 4, label: "Saqlangan kitoblar", stat: "bookmarks", icon: <HeartIcon />},
];

export default function UserPage() {
	const [books, setBooks] = useState([]);
	const [bookmarks, setBookmarks] = useState([]);
	const [user, setUser] = useState({});
	const [filters, setFilters] = useState("read");
	const [userProfileStats, setUserProfileStats] = useState({});

	let isMounted = false;
	let isLoading = false;
	useEffect(() => {
		if (isMounted) return;
		isLoading = true;
		fetchLatestBooks(4).then(setBooks);
		getMe().then(data => {
			setUser(data);
			fetchUserProfileStats(data.id).then(setUserProfileStats);
		});
		setBooks(prev => prev.slice(0, 4));
		isLoading = false;
		return () => {
			isMounted = true;
		};
	}, []);

	useEffect(() => {
		switch (filters) {
			case "read":
				fetchLatestBooks(4).then(setBooks);
				break;
			case "wishlist":
				fetchBookmarks().then(data => {
					setBookmarks(data.results);
				});
				break;
		}
	}, [filters]);

	const activeTabFilter =
		"bg-white font-semibold text-[#143c7b] shadow-sm border border-gray-100 transition hover:bg-gray-50";
	return (
		<div className="min-h-screen bg-[#f8f9fa] py-8 font-sans">
			<div className="max-w-300 mx-auto px-4 sm:px-6 space-y-6">
				{/* Yuqori Profil va Statistika */}
				<ProfileHeader user={user} />

				{!isLoading && (
					<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
						{stats.map(stat => (
							<StatsCard
								key={stat.id}
								stat={stat}
								value={userProfileStats[stat.stat]}
							/>
						))}
					</div>
				)}

				<GoalProgress hideProgress={true} />

				<div className="flex flex-wrap items-center gap-3 pt-4 pb-2">
					<button
						onClick={() => setFilters("read")}
						className={`${filters === "read" ? activeTabFilter : "bg-transparent font-medium text-[#5174ac]"} flex items-center gap-2 rounded-full  px-5 py-2.5 text-sm transition hover:bg-white hover:shadow-sm`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4 text-gray-400"
						>
							<circle cx="12" cy="12" r="10" />
							<polyline points="12 6 12 12 16 14" />
						</svg>
						O'qilgan kitoblar
					</button>
					<button
						onClick={() => setFilters("wishlist")}
						className={`${filters === "wishlist" ? activeTabFilter : "bg-transparent font-medium text-[#5174ac]"} flex items-center gap-2 rounded-full  px-5 py-2.5 text-sm transition hover:bg-white hover:shadow-sm`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4 text-gray-400"
						>
							<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
						</svg>
						Istaklar ro'yxati
					</button>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
					{filters === "read" &&

					books.map(book => (
						<NewArrivalCard key={book.id} book={book} />
					))}
					{filters === "wishlist" &&

					bookmarks.map(book => (
						<NewArrivalCard key={book.id} book={book} />
					))}
				</div>
			</div>
		</div>
	);
}
