import React from "react";
import coverImage from "../assets/cover-image.jpg";
import { FaStar, FaHeadphones, FaBookmark, FaDownload } from "react-icons/fa";

const book = {
  title: "Dahshat",
  author: "Abdulla Qahhor",
  rating: 4.7,
  reviews: 33,
  format: "Hardcover",
  pages: 304,
  publisher: "Viking",
  language: "English",
  isbn: "978-0525559474",
  publicationDate: "Sept 29, 2020",
};

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    time: "2 days ago",
    rating: 5,
    title: "Life-changing read!",
    text: "This book absolutely blew me away. The concept is fascinating and the execution is flawless.",
  },
  {
    id: 2,
    name: "Michael Chen",
    time: "1 week ago",
    rating: 4,
    title: "Beautiful and thought-provoking",
    text: "A beautiful exploration of regret, choice, and what makes life worth living.",
  },
  {
    id: 3,
    name: "Emma Williams",
    time: "2 weeks ago",
    rating: 5,
    title: "Couldn't put it down!",
    text: "The concept is brilliant and the execution is perfect.",
  },
];

const reviewStats = [
  { label: "5 star", value: 75 },
  { label: "4 star", value: 15 },
  { label: "3 star", value: 6 },
  { label: "2 star", value: 3 },
  { label: "1 star", value: 1 },
];

function BookCoverCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <img src={coverImage} alt={book.title} className="h-80 w-full rounded-2xl object-cover" />
      <div className="mt-4 space-y-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 font-semibold text-white">
          <FaDownload /> Yuklab olish
        </button>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white">
          <FaHeadphones /> Audioni tinglash
        </button>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">
          <FaBookmark /> Band qilish
        </button>
      </div>
    </div>
  );
}

function BookDetailsPanel() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <h1 className="text-3xl font-bold text-[#1a478e]">{book.title}</h1>
      <p className="text-sm text-gray-500">by {book.author}</p>
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
        <div className="flex text-yellow-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar key={index} />
          ))}
        </div>
        <span className="font-semibold text-[#1a478e]">{book.rating}</span>
        <span>({book.reviews} kommentlar)</span>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold text-gray-700">Book Details</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <p>Format:</p>
          <p className="font-semibold text-gray-800">{book.format}</p>
          <p>Pages:</p>
          <p className="font-semibold text-gray-800">{book.pages}</p>
          <p>Publisher:</p>
          <p className="font-semibold text-gray-800">{book.publisher}</p>
          <p>Language:</p>
          <p className="font-semibold text-gray-800">{book.language}</p>
          <p>ISBN-13:</p>
          <p className="font-semibold text-gray-800">{book.isbn}</p>
          <p>Publication Date:</p>
          <p className="font-semibold text-gray-800">{book.publicationDate}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold text-gray-700">About This Book</h2>
        <p className="mt-3 text-sm text-gray-600">
          Between life and death there is a library, and within that library, the shelves go on forever.
          Every book provides a chance to try another life you could have lived.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Fiction', 'Fantasy', 'Contemporary', 'Philosophy'].map((tag) => (
            <span key={tag} className="rounded-full bg-[#edf2f7] px-3 py-1 text-xs text-[#1a478e]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewSummary() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-sm font-semibold text-gray-700">Customer Reviews</h3>
          <p className="mt-2 text-4xl font-bold text-[#1a478e]">4.5</p>
          <p className="text-sm text-gray-500">Based on 2,847 reviews</p>
        </div>
        <div className="flex-1 space-y-2">
          {reviewStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="w-12 text-xs text-gray-500">{stat.label}</span>
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
              <span className="w-10 text-xs text-gray-500">{stat.value}%</span>
            </div>
          ))}
        </div>
        <button className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
          Write a Review
        </button>
      </div>
    </div>
  );
}

function ReviewList() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 py-4 last:border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{review.name}</p>
              <p className="text-xs text-gray-400">{review.time}</p>
            </div>
            <div className="flex text-yellow-500">
              {Array.from({ length: review.rating }).map((_, index) => (
                <FaStar key={index} />
              ))}
            </div>
          </div>
          <h4 className="mt-2 text-sm font-semibold text-gray-800">{review.title}</h4>
          <p className="mt-2 text-sm text-gray-600">{review.text}</p>
        </div>
      ))}
      <button className="mt-4 text-sm font-semibold text-[#1a478e]">Load More Reviews</button>
    </div>
  );
}

/**
 * BookDetailPage Component
 * Responsibility: Display book detail layout
 */
export default function BookDetailPage() {
  return (
    <div className="space-y-8 bg-[#f6f6f6] px-4 py-8 sm:px-6">
      <div className="custom-container grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <BookCoverCard />
        <BookDetailsPanel />
      </div>

      <div className="custom-container space-y-6">
        <ReviewSummary />
        <ReviewList />
      </div>
    </div>
  );
}
