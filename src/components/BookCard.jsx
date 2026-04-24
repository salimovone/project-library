// components/BookCard.tsx
import React from 'react';
import {
  FaBook,
  FaHeadphones,
  FaBookmark,
  FaStar
} from 'react-icons/fa';

const BookCard = ({
  title = "Book Title",
  author = "Author Name",
  coverImage,
  rating = 0.0,
  ratingCount = 0,
  onClick,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white rounded-xl shadow-md overflow-hidden 
        hover:shadow-xl transition-all duration-300 cursor-pointer
        ${className}
      `}
      style={{ width: '280px', minWidth: '240px' }} // card kengligini o'zingiz o'zgartirishingiz mumkin
    >
      {/* Cover rasm */}
      <div className="relative">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`${title} muqovasi`}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-80 bg-linear-to-br from-[#003366] to-[#1a478e] p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse bg-repeat"></div>
            <FaBook className="text-4xl text-blue-200/40 mb-3 relative z-10" />
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-3 leading-snug relative z-10 px-1 drop-shadow-sm">{title}</h3>
            <div className="h-0.5 w-8 bg-blue-400 rounded-full mb-2 relative z-10"></div>
            <p className="text-blue-200 font-medium text-sm leading-snug relative z-10 line-clamp-2 px-2">{author}</p>
          </div>
        )}

        {/* Rating badge (yuqori o'ng burchakda) */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-md">
          <FaStar className="text-yellow-400 text-base" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Content qismi */}
      <div className="p-4 space-y-1">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm">{author}</p>

        {/* Iconlar + rating */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-gray-500">
            <FaBook className="text-xl hover:text-blue-600 transition-colors" title="O'qish" />
            <FaHeadphones className="text-xl hover:text-pink-600 transition-colors" title="Audio" />
            <FaBookmark className="text-xl hover:text-orange-600 transition-colors" title="Saqlash" />
          </div>

          <div className="flex items-center gap-1 text-sm font-medium">
            <FaStar className="text-yellow-500" />
            <span className="text-gray-700">{rating}</span>
            <span className="text-gray-400 text-xs">★</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;