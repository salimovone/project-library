import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { FaBookmark, FaDownload, FaHeadphones, FaCheck, FaClock, FaBookReader, FaUndo, FaEdit, FaTrash } from "react-icons/fa";
import useRole from "../../../hooks/useRole";
import { reserveBookStudent } from "../../../services/reservations";
import { deleteBook } from "../../../services/bookService";
import Modal from "../../../components/Modal";

export default function BookCoverCard({ book }) {
  const fallbackImg = "https://via.placeholder.com/300x450?text=Kitob+Muqovasi";
  const { checkUserLevel } = useRole();
  const navigate = useNavigate();
  const isLibrarian = checkUserLevel("librarian");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBook(book.id);
      navigate("/books");
    } catch (e) {
      alert("O'chirishda xatolik yuz berdi");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

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
      window.open(book.pdf, '_blank');
    }
  };

  // Lokal holatni boshqarish
  const [currentStatus, setCurrentStatus] = useState(book.reservation_status);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl h-full p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)] self-start sticky top-24 bg-white">
      {book?.img ? (
        <img
          src={book.img}
          alt={book?.name}
          className="h-100 w-full rounded-2xl object-cover shadow-sm"
        />
      ) : (
        <div className="h-100 w-full rounded-2xl bg-linear-to-br from-[#003366] to-[#1a478e] p-6 flex flex-col items-center justify-center text-center shadow-lg border border-blue-900 border-opacity-30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
          <FaBookReader className="text-6xl text-blue-200/40 mb-5 relative z-10" />
          <h2 className="text-[22px] font-extrabold text-white mb-3 line-clamp-4 leading-snug relative z-10 px-2 drop-shadow-md">{book?.name}</h2>
          <div className="h-1 w-12 bg-blue-400 rounded-full mb-3 relative z-10"></div>
          <p className="text-blue-200 font-semibold text-[16px] leading-snug relative z-10 line-clamp-2 px-4 shadow-sm">{book?.author?.[0]?.name || "Noma'lum muallif"}</p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {book.has_pdf && (
          <button onClick={handleDownloadURL} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 font-semibold text-white transition hover:bg-orange-500 ">
            <FaDownload /> Yuklab olish
          </button>
        )}

        {/* <button
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:bg-pink-300"
          disabled={!checkUserLevel("student") || !book.has_audio}
        >
          <FaHeadphones /> Audioni tinglash 
        </button> */}

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

        {isLibrarian && (
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate(`/books/${book.id}/edit`)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <FaEdit /> Tahrirlash
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              <FaTrash /> O'chirish
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="O'chirishni tasdiqlash"
      >
        <div className="text-gray-700">
          Rostdan ham ushbu kitobni o'chirishni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition ${deleteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {deleteLoading ? "O'chirilmoqda..." : "Ha, o'chirish"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}