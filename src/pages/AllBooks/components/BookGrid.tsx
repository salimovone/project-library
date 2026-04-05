import { NewArrivalCard } from "../../../components";

const BookCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
    <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="mt-1 h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function BookGrid({ books, handleLoadMore, isLoading }) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))
          : books.map((book) => <NewArrivalCard key={book.id} book={book} />)}
      </div>

      {!isLoading && (
        <div className="mt-12 mb-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="rounded-full border border-[#003282] px-8 py-2.5 text-sm font-semibold text-[#003282] transition hover:bg-[#003282] hover:text-white"
          >
            Yana yuklash
          </button>
        </div>
      )}
    </>
  );
}
