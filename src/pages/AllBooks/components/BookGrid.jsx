import { NewArrivalCard } from "../../../components";

const BookCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 w-full transition-colors duration-300"></div>
    <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 transition-colors duration-300"></div>
    <div className="mt-1 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 transition-colors duration-300"></div>
  </div>
);

export default function BookGrid({ books, isLoading }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 mb-10">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <BookCardSkeleton key={`initial-skeleton-${index}`} />
          ))
        : books.map((book) => <NewArrivalCard key={book.id} book={book} />)}
    </div>
  );
}
