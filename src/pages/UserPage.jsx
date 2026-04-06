import { useEffect, useState } from "react";
import { NewArrivalCard } from "../components/index.js";
import { getMe } from "../services/userService.js";
import { fetchUserProfileStats } from "../services/additional.js";
import {
  BookIcon,
  ClockIcon,
  GoalProgress,
  HeartIcon,
  ProfileHeader,
  StatsCard,
  TrophyIcon,
} from "../components/usePage/index.js";
import { fetchReservations } from "../services/reservations.js";

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
  { id: 3, label: "Baholangan kitoblar", stat: "ratings", icon: <TrophyIcon /> },
  { id: 4, label: "Saqlangan kitoblar", stat: "bookmarks", icon: <HeartIcon /> },
];

export default function UserPage() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({});
  // Tablarning statuslari: "reading" (O'qilayotgan), "reserved" (Band qilingan), "read" (O'qilgan)
  const [activeTab, setActiveTab] = useState("reading"); 
  const [userProfileStats, setUserProfileStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Dastlabki foydalanuvchi ma'lumotlarini yuklash
  useEffect(() => {
    getMe().then((data) => {
      setUser(data);
      fetchUserProfileStats(data.id).then(setUserProfileStats);
    });
  }, []);

  // Tab o'zgarganda kitoblarni yuklash
  useEffect(() => {
    setIsLoading(true);
    setBooks([]); // Yangi tabga o'tganda eskisini tozalab turamiz
    
    let status = "";
    switch (activeTab) {
      case "reading":
        status = "given,not_returned"; // Qo'lda va qaytarilmagan
        break;
      case "reserved":
        status = "pending,approved"; // Kutilayotgan yoki tasdiqlangan (Band qilingan)
        break;
      case "read":
        status = "returned"; // Qaytarilgan (O'qib bo'lingan)
        break;
      default:
        break;
    }

    // API chaqiruvi (activeTab parametri bilan)
    fetchReservations({user_id: user.id, status })
      .then((data) => {
        setBooks(data.results || data || []);
      })
      .catch((err) => console.error("Xatolik:", err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTab]);

  const activeTabFilter = "bg-white font-semibold text-[#143c7b] shadow-sm border border-gray-100 transition hover:bg-gray-50";
  const inactiveTabFilter = "bg-transparent font-medium text-[#5174ac] hover:bg-white hover:shadow-sm";

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 font-sans">
      <div className="max-w-300 mx-auto px-4 sm:px-6 space-y-6">
        {/* Yuqori Profil va Statistika */}
        <ProfileHeader user={user} />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.id}
              stat={stat}
              value={userProfileStats[stat.stat] || 0}
            />
          ))}
        </div>

        <GoalProgress hideProgress={true} />

        {/* TABLAR */}
        <div className="flex flex-wrap items-center gap-3 pt-4 pb-2">
          {/* 1-Tab: O'qilayotgan */}
          <button
            onClick={() => setActiveTab("reading")}
            className={`${
              activeTab === "reading" ? activeTabFilter : inactiveTabFilter
            } flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-blue-500"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            O'qilayotgan
          </button>

          {/* 2-Tab: Band qilingan */}
          <button
            onClick={() => setActiveTab("reserved")}
            className={`${
              activeTab === "reserved" ? activeTabFilter : inactiveTabFilter
            } flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-orange-500"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Band qilingan
          </button>

          {/* 3-Tab: O'qilgan */}
          <button
            onClick={() => setActiveTab("read")}
            className={`${
              activeTab === "read" ? activeTabFilter : inactiveTabFilter
            } flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-green-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            O'qilgan
          </button>
        </div>

        {/* KITOBLAR RO'YXATI */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500 font-medium">Kitoblar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
            {books.length > 0 ? (
              books.map((book) => <NewArrivalCard key={book.id} book={book} />)
            ) : (
              <div className="col-span-full py-8 text-center text-gray-400">
                Bu bo'limda hozircha kitoblar yo'q
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}