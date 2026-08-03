import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BookCard from "../components/BookCard";
import { getMe } from "../services/userService.js";
import { fetchUserProfileStats } from "../services/additional.js";
import {
  ProfileHeader,
  StatsCard,
  GoalProgress,
  BookIcon,
  ClockIcon,
  TrophyIcon,
  HeartIcon,
} from "../components/usePage/index.js";
import { fetchReservations } from "../services/reservations.js";

const stats = [
  {
    id: 1,
    label: "O'qilgan kitoblar",
    stat: "returned_reservations",
    icon: <BookIcon />,
  },
  {
    id: 2,
    label: "Kutilayotgan kitoblar",
    stat: "pending_reservations",
    icon: <ClockIcon />,
  },
  { id: 3, label: "Baholanganlar", stat: "ratings", icon: <TrophyIcon /> },
  { id: 4, label: "Saqlanganlar", stat: "bookmarks", icon: <HeartIcon /> },
];

export default function UserPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("reading");
  const [userProfileStats, setUserProfileStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMe().then((data) => {
      if (data) {
        setUser(data);
        fetchUserProfileStats(data.id).then(setUserProfileStats);
      }
    });
  }, []);

  useEffect(() => {
    if (!user.id) return;
    setIsLoading(true);
    setBooks([]);

    let status = "";
    switch (activeTab) {
      case "reading":
        status = "given,not_returned";
        break;
      case "reserved":
        status = "pending,approved";
        break;
      case "read":
        status = "returned";
        break;
      default:
        break;
    }

    fetchReservations({ user_id: user.id, status })
      .then((data) => {
        setBooks(data.results || data || []);
      })
      .catch((err) => console.error("Reservations error:", err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTab, user.id]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-interface transition-colors duration-300 py-8 px-4 md:px-10">
      <div className="max-w-[1320px] mx-auto flex flex-col gap-6">
        {/* Header Profile Info */}
        <ProfileHeader user={user} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.id}
              stat={stat}
              value={userProfileStats[stat.stat] || 0}
            />
          ))}
        </div>

        <GoalProgress hideProgress={true} />

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3 pt-2">
          {[
            { key: "reading", label: "O'qilayotgan" },
            { key: "reserved", label: "Band qilingan" },
            { key: "read", label: "O'qilgan" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[var(--navy-primary)] text-white shadow-xs"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-[var(--navy-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16 text-[var(--navy-primary)] font-bold text-base">
            Kitoblar yuklanmoqda...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {books.length > 0 ? (
              books.map((item) => {
                const bookData = item.book || item;
                return (
                  <BookCard
                    key={item.id || bookData.id}
                    book={bookData}
                    onClick={() => navigate(`/books/${bookData.id}`)}
                  />
                );
              })
            ) : (
              <div className="col-span-full bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-12 text-center text-[var(--text-muted)] font-medium">
                Bu bo'limda hozircha kitoblar yo'q.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}