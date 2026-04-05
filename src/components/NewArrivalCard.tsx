import React from 'react';
import { Link } from "react-router";

interface Tag {
  id: string | number;
  name: string;
}

interface Author {
  name: string;
}

interface Book {
  id: string | number;
  name: string;
  img?: string;
  author?: Author[];
  tags?: Tag[];
  rating?: number | string;
}

interface NewArrivalCardProps {
  book: Book;
}

export default function NewArrivalCard({ book }: NewArrivalCardProps) {
  const imageUrl = book.img;

  return (
    <Link
      to={`/books/${book.id}`}
      className="flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
    >
      <div className="w-full aspect-4/5 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={book?.name} 
          className="h-full w-full object-cover" 
        />
      </div>

      <div className="flex flex-col grow p-4">
        <h3 className="text-base font-semibold text-[#1a478e] line-clamp-1" title={book?.name}>
          {book?.name}
        </h3>
        {
          (book.author) && book.author.map((author, idx) => (
            <p key={idx+1} className="text-sm text-gray-500 line-clamp-1">{author?.name}</p>
          ))
        }

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {book.tags?.slice(0, 2).map((tag) => (
              <span 
                key={tag.id} 
                className="rounded-md bg-[#edf2f7] px-2 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {tag?.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-sm font-semibold text-[#1a478e]">
            {
              (book.rating) &&
              (<span className="rounded-md bg-[#edf2f7] px-2 py-1">{book.rating}</span>)
            }
            <span className="text-red-500">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
