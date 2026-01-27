import React from "react";
import { FaBookOpen, FaClock, FaTrophy, FaHeart } from "react-icons/fa";

const stats = [
  {
    id: 1,
    label: "O'qilgan kitoblar soni",
    value: 47,
    icon: <FaBookOpen />,
  },
  {
    id: 2,
    label: "Jami o'qilgan soati",
    value: 312,
    icon: <FaClock />,
  },
  {
    id: 3,
    label: "Fakultetdagi reyting",
    value: 12,
    icon: <FaTrophy />,
  },
  {
    id: 4,
    label: "Sevimli kitoblar",
    value: 47,
    icon: <FaHeart />,
  },
];

function ProfileHeader() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-300 text-2xl font-bold text-[#1a478e]">
          H
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1a478e]">Husen Komilov</h1>
          <p className="text-sm text-gray-500">@husenkomilov</p>
          <p className="text-xs text-gray-400">Oxirgi tashrif 10 kun oldin.</p>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ stat }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2f7] text-[#1a478e]">
        {stat.icon}
      </div>
      <p className="mt-3 text-2xl font-semibold text-[#1a478e]">{stat.value}</p>
      <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
    </div>
  );
}

/**
 * UserPage Component
 * Responsibility: Display user profile overview
 */
export default function UserPage() {
  return (
    <div className="bg-[#f6f6f6] px-4 py-8 sm:px-6">
      <div className="custom-container space-y-6">
        <ProfileHeader />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <button className="rounded-full border border-gray-200 bg-white px-4 py-2">Sevimlilar</button>
          <button className="rounded-full border border-gray-200 bg-white px-4 py-2">O'qilgan kitoblar</button>
          <button className="rounded-full border border-gray-200 bg-white px-4 py-2">Istaklar ro'yxati</button>
        </div>
      </div>
    </div>
  );
}
