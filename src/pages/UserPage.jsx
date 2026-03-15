import {useEffect, useState} from "react";
import {Link} from "react-router";
import {NewArrivalCard} from "../components";
import {fetchLatestBooks} from "../services/bookService";
import {formatDateReadable} from "../utils/helper";
import {fetchBookmarks, getMe} from "../services/userService";
import {fetchUserProfileStats} from "../services/additional";

const BookIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-7 w-7 text-[#e02424] mb-3 mx-auto"
	>
		<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
	</svg>
);

const ClockIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-7 w-7 text-[#e02424] mb-3 mx-auto"
	>
		<circle cx="12" cy="12" r="10" />
		<polyline points="12 6 12 12 16 14" />
	</svg>
);

const TrophyIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-7 w-7 text-[#e02424] mb-3 mx-auto"
	>
		<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
		<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
		<path d="M4 22h16" />
		<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
		<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
		<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
	</svg>
);

const HeartIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-7 w-7 text-[#e02424] mb-3 mx-auto"
	>
		<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
	</svg>
);

const TargetIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-8 w-8 text-[#143c7b]"
	>
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="12" r="6" />
		<circle cx="12" cy="12" r="2" />
	</svg>
);

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

function ProfileHeader({user}) {
	return (
		<div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
			<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
				<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#e02424] text-3xl text-[#143c7b] bg-white shrink-0">
					{user.first_name ? user.first_name[0].toUpperCase() : "K"}
				</div>
				<div className="text-center sm:text-left pt-2">
					<h1 className="text-2xl font-semibold text-[#143c7b] leading-tight">
						{user.first_name ? user.first_name : "Kitobxon"} {user.last_name}
					</h1>
					<div className="mt-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-[15px]">
						<span className="text-gray-500">
							{formatDateReadable(user.last_login)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatsCard({stat, value}) {
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

function GoalProgress({hideProgress}) {
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

export default function UserPage() {
	const [books, setBooks] = useState([]);
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
				console.log("read");
				break;
			case "wishlist":
				fetchBookmarks().then(setBooks);
				console.log("wishlist");
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
					{books.map(book => (
						<NewArrivalCard key={book.id} book={book} />
					))}
				</div>
			</div>
		</div>
	);
}
