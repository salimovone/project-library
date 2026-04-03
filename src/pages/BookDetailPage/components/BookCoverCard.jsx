import { useState, useMemo } from "react";
import { FaBookmark, FaDownload, FaHeadphones, FaCheck, FaClock, FaBookReader, FaUndo } from "react-icons/fa";
import useRole from "../../../hooks/useRole";
import { reserveBookStudent } from "../../../services/reservations";

export default function BookCoverCard({ book }) {
  const fallbackImg = "https://via.placeholder.com/300x450?text=Kitob+Muqovasi";
  const imageUrl = book.img ? book.img : fallbackImg;
  const { checkUserLevel } = useRole();

 const handleDownloadURL = async () => {
  if (!book.pdf) return;

  try {
    const fileUrl = book.pdf;
    const fileName = fileUrl.split("/").pop() || "kitob.pdf";

    const response = await fetch(fileUrl);
    
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Fayl nomini beramiz
    document.body.appendChild(link);
    
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url); 
  } catch (error) {
    console.error("Yuklab olishda xatolik:", error);
    window.open(book.pdf, '_blank');
  }
};

  // Lokal holatni boshqarish
  const [currentStatus, setCurrentStatus] = useState(book.reservation_status); 
  const [loading, setLoading] = useState(false);

  // Statusga qarab tugma ko'rinishini aniqlash
  const statusConfig = useMemo(() => {
    switch (currentStatus) {
      case "pending":
        return {
          text: "Kutilmoqda",
          color: "bg-yellow-500",
          icon: <FaClock />,
          disabled: true,
        };
      case "approved":
        return {
          text: "Tasdiqlandi",
          color: "bg-green-600",
          icon: <FaCheck />,
          disabled: true,
        };
      case "given":
        return {
          text: "Sizda",
          color: "bg-purple-600",
          icon: <FaBookReader />,
          disabled: true,
        };
      case "returned":
        return {
          text: "Qaytarilgan (Yana olish)",
          color: "bg-blue-600",
          icon: <FaBookmark />,
          disabled: false,
        };
      case "not_returned":
        return {
          text: "Qaytarilmadi",
          color: "bg-red-600",
          icon: <FaUndo />,
          disabled: true,
        };
      default: // null yoki bo'sh bo'lsa (ya'ni hali band qilinmagan)
        return {
          text: "Band qilish",
          color: "bg-blue-600",
          icon: <FaBookmark />,
          disabled: false,
        };
    }
  }, [currentStatus]);

  const handleBookmark = async () => {
    if (loading || statusConfig.disabled) return;
    
    setLoading(true);
    try {
      await reserveBookStudent(book.id);
      setCurrentStatus("pending"); // Band qilinganda srazu "pending"ga o'tadi
      console.log("Muvaffaqiyatli so'rov yuborildi!");
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl h-full p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)] self-start sticky top-24 bg-white">
      <img
        src={imageUrl}
        alt={book?.name}
        className="h-100 w-full rounded-2xl object-cover shadow-sm"
      />
      
      <div className="mt-6 space-y-3">
        {book.has_pdf && (
          <button onClick={handleDownloadURL} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 font-semibold text-white transition hover:bg-orange-500 ">
            <FaDownload /> Yuklab olish
          </button>
        )}

        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:bg-pink-300"
          disabled={!checkUserLevel("student") || !book.has_audio}
        >
          <FaHeadphones /> Audioni tinglash 
        </button>

        <button
          onClick={handleBookmark}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition duration-300 
            ${statusConfig.color} ${statusConfig.disabled ? "cursor-default opacity-90" : "hover:brightness-110 cursor-pointer"}`}
          disabled={!checkUserLevel("student") || loading || (statusConfig.disabled && currentStatus !== 'returned')}
        >
          {loading ? (
            <span className="animate-pulse">Yuklanmoqda...</span>
          ) : (
            <>
              {statusConfig.icon} {statusConfig.text}
            </>
          )}
        </button>
      </div>
    </div>
  );
}