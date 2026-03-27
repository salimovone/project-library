import { FaBookmark, FaDownload, FaHeadphones } from "react-icons/fa";
import useRole from "../../../hooks/useRole";

export default function BookCoverCard({ book }) {
  const fallbackImg = "https://via.placeholder.com/300x450?text=Kitob+Muqovasi";
  const imageUrl = book.img ? book.img : fallbackImg;
  const { checkUserLevel } = useRole()

  // -- BO'SH FUNKSIYALAR --
  const handleDownload = () => {
    /* Kitobni yuklab olish logikasi */ console.log("Yuklanmoqda...");
  };
  const handleListen = () => {
    /* Audio formatga o'tish logikasi */ console.log("Audio yoqilmoqda...");
  };
  const handleBookmark = () => {
    /* Kutubxonaga saqlash logikasi */ console.log("Saqlandi!");
  };

  return (
    <div className="rounded-2xl h-full p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)] self-start sticky top-24">
      <img
        src={imageUrl}
        alt={book?.name}
        className="h-100 w-full rounded-2xl object-cover shadow-sm"
      />
      <div className="mt-6 space-y-3">
        {book.is_available && (
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 font-semibold text-white transition hover:bg-orange-500"
          >
            <FaDownload /> Yuklab olish
          </button>
        )}
        <button
          onClick={handleListen}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:bg-pink-300"
          disabled={!checkUserLevel("student")}
        >
          <FaHeadphones /> Audioni tinglash
        </button>
        <button
          onClick={handleBookmark}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          disabled={!checkUserLevel("student")}
        >
          <FaBookmark /> Band qilish
        </button>
      </div>
    </div>
  );
}
