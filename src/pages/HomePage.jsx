import React from "react";
import { FaBrain, FaThLarge } from "react-icons/fa";
import { CategoryCard, MostReadCard, NewArrivalCard, SectionHeader, StatsBar } from "../components";
import coverImage from "../assets/cover-image.jpg";

const categories = Array.from({ length: 9 }, () => ({
  label: "Psixologiya",
  icon: <FaBrain className="text-2xl text-[#1a478e]" />,
})).concat({ label: "Barchasi", icon: <FaThLarge className="text-2xl text-[#1a478e]" /> });

const stats = [
  { label: "Books Available", value: "50,000+" },
  { label: "Active Members", value: "15,000+" },
  { label: "Categories", value: "200+" },
  { label: "Access", value: "24/7" },
];

const newArrivals = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: "Dahshat",
  author: "Abdulla Qahhor",
  rating: "4.7",
  image: coverImage,
  href: "#",
  badges: ["book", "audio", "bookmark"],
}));

const mostRead = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "Dahshat",
  author: "Abdulla Qahhor",
  rating: "4.7",
  image: coverImage,
  href: "#",
  badges: ["book", "audio", "bookmark"],
}));

/**
 * HomePage Component
 * Responsibility: Compose the home page layout
 */
export default function HomePage() {
  return (
    <div className="space-y-14 pb-16">
      <section className="bg-[#f4f4f4] py-10">
        <div className="custom-container space-y-6">
          <SectionHeader title="Yangi qo'shilgan kitoblar" actionLabel="Barchasi" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((book) => (
              <NewArrivalCard key={book.id} book={book} href={`/books/${book.id}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="custom-container space-y-6">
        <h2 className="text-xl font-semibold text-[#1a478e]">Sizni nima qiziqtiradi?</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, idx) => (
            <CategoryCard key={idx + 1} icon={category.icon} label={category.label} />
          ))}
        </div>
      </section>

      <section className="custom-container space-y-6">
        <SectionHeader title="Eng ko'p o'qilganlar" actionLabel="Barchasi" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mostRead.map((book) => (
            <MostReadCard key={book.id} book={book} href={`/books/${book.id}`} />
          ))}
        </div>
      </section>

      <StatsBar stats={stats} />
    </div>
  );
}
