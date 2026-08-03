import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { FaBookmark, FaDownload, FaHeadphones, FaCheck, FaClock, FaBookReader, FaUndo, FaEdit, FaTrash } from "react-icons/fa";
import useRole from "../../../hooks/useRole";
import { reserveBookStudent } from "../../../services/reservations";
import { deleteBook } from "../../../services/bookService";
import Modal from "../../../components/Modal";
import PdfReaderModal from "../../../components/PdfReaderModal";

export default function BookCoverCard({ book }) {
  const { checkUserLevel } = useRole();
  const navigate = useNavigate();
  const isLibrarian = checkUserLevel("librarian");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
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
    if (!book?.file_pdf && !book?.pdf) return;

    try {
      const fileUrl = book.file_pdf || book.pdf;
      const fileName = fileUrl.split("/").pop() || "kitob.pdf";

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(book.file_pdf || book.pdf, "_blank");
    }
  };

  const [currentStatus, setCurrentStatus] = useState(book?.reservation_status);
  const [loading, setLoading] = useState(false);

  const statusConfig = useMemo(() => {
    switch (currentStatus) {
      case "pending":
        return {
          text: "Kutilmoqda",
          color: "bg-[#e0a32e]",
          icon: <FaClock className="text-sm" />,
          disabled: true,
        };
      case "approved":
        return {
          text: "Tasdiqlandi",
          color: "bg-[#3f9e5f]",
          icon: <FaCheck className="text-sm" />,
          disabled: true,
        };
      case "given":
        return {
          text: "Sizda",
          color: "bg-[var(--navy-primary)]",
          icon: <FaBookReader className="text-sm" />,
          disabled: true,
        };
      case "returned":
        return {
          text: "Yana band qilish",
          color: "bg-[var(--crimson-primary)]",
          icon: <FaBookmark className="text-sm" />,
          disabled: false,
        };
      default:
        return {
          text: "Band qilish",
          color: "bg-[var(--crimson-primary)]",
          icon: <FaBookmark className="text-sm" />,
          disabled: false,
        };
    }
  }, [currentStatus]);

  const handleBookmark = async () => {
    if (loading || statusConfig.disabled) return;

    setLoading(true);
    try {
      await reserveBookStudent(book.id);
      setCurrentStatus("pending");
    } catch (error) {
      console.error("Reserve error:", error);
    } finally {
      setLoading(false);
    }
  };

  const reserveStates = [
    { label: "Band qilingan", state: "Kutilmoqda" },
    { label: "Kutubxonachi tasdiqladi", state: "Tasdiqlandi" },
    { label: "Qo'lda", state: "Sizda" },
    { label: "Qaytarildi", state: "Yopildi" },
  ];

  return (
    <div className="flex flex-col gap-3.5 font-interface">
      {/* Cover Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-4.5 shadow-xs">
        {book?.cover_image || book?.img ? (
          <div className="relative aspect-3/4 rounded-xl overflow-hidden shadow-xs">
            <img
              src={book.cover_image || book.img}
              alt={book?.title || book?.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-gradient-to-br from-[#3d6cb0] via-[#2a538f] to-[#1b3f7a] p-6 flex flex-col items-center justify-center text-center">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_12%,rgba(255,255,255,0.16),transparent_55%)]" />
            <span className="absolute left-0 top-0 bottom-0 w-2.5 bg-[var(--crimson-primary)]" />
            <span className="font-editorial text-2xl md:text-3xl font-normal text-white relative leading-tight">
              {book?.title || book?.name}
            </span>
            <span className="w-8 h-0.5 bg-[var(--crimson-accent)] rounded-full my-3.5 relative" />
            <span className="text-xs font-semibold text-[#b9c6de] relative">
              {Array.isArray(book?.author)
                ? book.author.map((a) => (typeof a === "object" ? a.name || a.sortingname || "" : a)).filter(Boolean).join(", ")
                : typeof book?.author === "object"
                ? book.author.name || book.author.sortingname || "Noma'lum muallif"
                : book?.author || "Noma'lum muallif"}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        {(book?.file_pdf || book?.pdf || book?.has_pdf || book?.file_audio || book?.has_audio) && (
          <div className="flex flex-col gap-2.5 mt-4.5">
            {(book?.file_pdf || book?.pdf || book?.has_pdf) && (
              <button
                onClick={() => setShowPdfModal(true)}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--navy-primary)] text-white text-sm font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                <FaBookReader className="text-base" /> Onlayn o'qish
              </button>
            )}

            {(() => {
              const hasPdf = !!(book?.file_pdf || book?.pdf || book?.has_pdf);
              const hasAudio = !!(book?.file_audio || book?.has_audio);
              if (!hasPdf && !hasAudio) return null;

              return (
                <div className={`grid ${hasPdf && hasAudio ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
                  {hasPdf && (
                    <button
                      onClick={handleDownloadURL}
                      className="flex items-center justify-center gap-1.5 h-11 w-full rounded-xl bg-[var(--orange-pdf-bg)] border border-[var(--orange-pdf-border)] text-[var(--orange-pdf)] text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
                    >
                      <FaDownload className="text-xs" /> PDF Yuklab olish
                    </button>
                  )}
                  {hasAudio && (
                    <button
                      onClick={() => alert("Audio pleer ochilmoqda...")}
                      className="flex items-center justify-center gap-1.5 h-11 w-full rounded-xl bg-[var(--crimson-light)] border border-[var(--crimson-border)] text-[var(--crimson-primary)] text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
                    >
                      <FaHeadphones className="text-xs" /> Audio
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Reservation Block */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-4.5 shadow-xs flex flex-col gap-3">
        <span className="text-[11.5px] font-extrabold tracking-widest uppercase text-[var(--text-subtle)] block">
          Fizik nusxa
        </span>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3f9e5f]" />
          <span className="text-sm font-bold text-[var(--text-main)]">
            Mavjud — {book?.total_copies || 24} nusxa
          </span>
        </div>

        <button
          onClick={handleBookmark}
          disabled={!checkUserLevel("student") || loading || statusConfig.disabled}
          className={`flex items-center justify-center gap-2 h-12 rounded-xl text-white text-sm font-bold transition shadow-xs ${statusConfig.color} ${
            statusConfig.disabled ? "cursor-default opacity-90" : "hover:opacity-90 cursor-pointer"
          }`}
        >
          {loading ? "Yuklanmoqda..." : <>{statusConfig.icon} {statusConfig.text}</>}
        </button>

        <span className="text-xs text-[var(--text-subtle)] leading-relaxed">
          Band qilingandan so'ng 48 soat ichida kutubxonadan olib ketishingiz kerak. Kutubxonachi tasdiqlaganda xabar keladi.
        </span>

        <div className="h-px bg-[var(--border-main)] my-1" />

        <div className="flex flex-col gap-2">
          {reserveStates.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-semibold text-[var(--text-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                {s.label}
              </span>
              <span className="font-bold text-[var(--text-subtle)]">{s.state}</span>
            </div>
          ))}
        </div>

        {isLibrarian && (
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[var(--border-main)]">
            <button
              onClick={() => navigate(`/books/${book.id}/edit`)}
              className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[var(--navy-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              <FaEdit /> Tahrirlash
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[var(--crimson-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
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
        <div className="text-[var(--text-main)] font-interface">
          Rostdan ham ushbu kitobni o'chirishni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-5 py-2.5 rounded-xl border border-[var(--border-main)] text-[var(--text-muted)] font-bold text-xs hover:bg-[var(--bg-subtle)] transition cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-5 py-2.5 rounded-xl bg-[var(--crimson-primary)] text-white font-bold text-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {deleteLoading ? "O'chirilmoqda..." : "Ha, o'chirish"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Inline PDF Reader Modal */}
      <PdfReaderModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        book={book}
      />
    </div>
  );
}