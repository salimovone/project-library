import React from "react";
import { FaBrain, FaBook, FaHeadphones, FaBookmark, FaThLarge } from "react-icons/fa";
import coverImage from "../assets/cover-image.jpg";
import CategoryCard from "../components/CategoryCard";
import MostReadCard from "../components/MostReadCard";
import NewArrivalCard from "../components/NewArrivalCard";
import SectionHeader from "../components/SectionHeader";
import StatsBar from "../components/StatsBar";

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
    <div className="space-y-12 bg-[#f6f6f6] pb-12">
      <section className="custom-container pt-6">
        <SectionHeader title="Yangi qo'shilgan kitoblar" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newBooks.map((book) => (
            <NewArrivalCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="custom-container">
        <SectionHeader title="Sizni nima qiziqtiradi?" actionLabel={null} />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => (
            <CategoryCard key={`${category.label}-${index}`} label={category.label} icon={category.icon} />
          ))}
        </div>
      </section>

      <section className="custom-container">
        <SectionHeader title="Eng ko'p o'qilganlar" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {mostRead.map((book) => (
            <MostReadCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <StatsBar stats={stats} />
    </div>
  );
}
