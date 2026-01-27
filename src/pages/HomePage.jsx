import React from "react";
import { FaBrain, FaThLarge, FaBook, FaHeadphones } from "react-icons/fa";
import { BookCard } from "../components";
import coverImage from "../assets/cover-image.jpg";
import CategoryCard from "../components/CategoryCard";
import MostReadCard from "../components/MostReadCard";
import NewArrivalCard from "../components/NewArrivalCard";
import SectionHeader from "../components/SectionHeader";
import StatsBar from "../components/StatsBar";

// const stats = [
//   { label: "Kitoblar", value: "12K+" },
//   { label: "A'zo", value: "4.8K" },
//   { label: "Audio kitob", value: "1.2K" },
//   { label: "Muallif", value: "730" },
// ];

// const categories = [
//   "Badiiy adabiyot",
//   "Biznes",
//   "Dasturlash",
//   "Psixologiya",
//   "Tarix",
//   "Bolalar",
// ];

const features = [
  {
    title: "Moslashtirilgan tavsiyalar",
    description: "Sizning qiziqishlaringizga mos kitoblar har kuni yangilanadi.",
  },
  {
    title: "Audio va elektron format",
    description: "Bir platformada o'qish va tinglash imkoniyati.",
  },
  {
    title: "Smart qidiruv",
    description: "Muallif, mavzu yoki kalit so'z bo'yicha tezkor toping.",
  },
];

const newBooks = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: "Dahshat",
  author: "Abdulla Qahhor",
  rating: 4.7,
  image: coverImage,
  href: "/books/1",
  badges: [<FaBook key="book" />, <FaHeadphones key="audio" />, <FaBookmark key="save" />],
}));

const categories = Array.from({ length: 9 }, () => ({
  label: "Psixologiya",
  icon: <FaBrain />,
})).concat({ label: "Barchasi", icon: <FaThLarge /> });

const mostRead = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "Dahshat",
  author: "Abdulla Qahhor",
  rating: 4.7,
  image: coverImage,
  href: "/books/1",
  badges: [<FaBook key="book" />, <FaHeadphones key="audio" />, <FaBookmark key="save" />],
}));

const stats = [
  { label: "Books Available", value: "50,000+" },
  { label: "Active Members", value: "15,000+" },
  { label: "Categories", value: "200+" },
  { label: "Access", value: "24/7" },
];

/**
 * HomePage Component
 * Responsibility: Compose the home page layout
 */
export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="bg-[#f4f7fb]">
        <div className="custom-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center py-16">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1a478e] shadow">
              SmartLibrary • Bilim markazi
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#102a56] leading-tight">
              O'qish tajribasini yangi bosqichga olib chiqing
            </h1>
            <p className="text-lg text-gray-600">
              SmartLibrary yordamida minglab kitoblar, audio kitoblar va shaxsiy tavsiyalarni bir joyda toping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="rounded-full bg-[#1a478e] px-6 py-3 text-white font-semibold hover:bg-[#15396f] transition">
                Kutubxonani ko'rish
              </button>
              <button className="rounded-full border border-[#1a478e] px-6 py-3 text-[#1a478e] font-semibold hover:bg-white transition">
                Sinab ko'rish
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Kitob yoki muallif qidiring..."
                  className="w-full rounded-full bg-white py-3 pl-5 pr-20 text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button className="absolute right-2 top-2 rounded-full bg-[#1a478e] px-4 py-1.5 text-sm font-semibold text-white">
                  Qidirish
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                24/7 faol xizmat
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#dfe9fb]" />
            <div className="absolute -left-4 bottom-8 h-16 w-16 rounded-full bg-[#c8dcff]" />
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <img
                src={coverImage}
                alt="SmartLibrary cover"
                className="h-80 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="rounded-xl bg-[#f4f7fb] p-3">
                  <p className="font-semibold text-[#1a478e]">50+ to'plamlar</p>
                  <p>Yangi kolleksiyalar</p>
                </div>
                <div className="rounded-xl bg-[#f4f7fb] p-3">
                  <p className="font-semibold text-[#1a478e]">4.9 reyting</p>
                  <p>O'quvchilar tanlovi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="custom-container">
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-white p-6 shadow-md sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[#1a478e]">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="custom-container grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#102a56]">Nega aynan SmartLibrary?</h2>
          <p className="text-gray-600">
            Intellektual tavsiyalar, tezkor qidiruv va barcha formatlar — barchasi siz uchun.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-white p-5 shadow-md">
              <h3 className="font-semibold text-[#1a478e]">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="custom-container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-[#102a56]">Mashhur kategoriyalar</h2>
          <button className="text-sm font-semibold text-[#1a478e] hover:underline">Barchasini ko'rish</button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#1a478e] shadow hover:bg-[#1a478e] hover:text-white transition"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-14">
        <div className="custom-container flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-[#1a478e]">Yangi qo'shilgan kitoblar</h2>
          <button className="text-blue-600 hover:underline">Hammasini ko'rish</button>
        </div>
        <div className="custom-container mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array(8)
            .fill()
            .map((_, index) => (
              <div key={index} className="flex justify-center">
                <BookCard
                  coverImage={coverImage}
                  author="Abdulla Qahhor"
                  rating={4.7}
                  title="Asror Bobo"
                />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
