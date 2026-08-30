import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { CgSearch } from "react-icons/cg";
import {
  FiUser,
  FiClock,
  FiCheckCircle,
  FiBookOpen,
  FiX,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
  FiBarChart2,
  FiUsers,
  FiBook,
  FiDownload,
} from "react-icons/fi";
import {
  fetchReservations,
  updateReservationStatus,
} from "../services/reservations";
import { fetchMainPageStats } from "../services/additional";
import { fetchBooks, deleteBook } from "../services/bookService";
import { fetchUsersList } from "../services/userService";
import Modal from "../components/Modal";

const formatDateReadable = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BookControlPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "dashboard";

  // Shared state
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Reservations state
  const [resSubTab, setResSubTab] = useState("pending");
  const [reservations, setReservations] = useState([]);
  const [resTotalCount, setResTotalCount] = useState(0);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    borrowed: 0,
    returned: 0,
    overdue: 0,
  });
  const [showResModal, setShowResModal] = useState(false);
  const [selectedResItem, setSelectedResItem] = useState(null);
  const [selectedResIds, setSelectedResIds] = useState([]);

  // Books Fond state
  const [fondBooks, setFondBooks] = useState([]);
  const [fondPage, setFondPage] = useState(1);
  const [fondPageSize, setFondPageSize] = useState(25);
  const [fondTotalCount, setFondTotalCount] = useState(0);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [selectedBookToDelete, setSelectedBookToDelete] = useState(null);

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setFondPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load Main Stats & Tab Counts from API
  const loadTabCounts = async () => {
    try {
      const [allRes, pendingRes, borrowedRes, returnedRes, overdueRes] = await Promise.all([
        fetchReservations({ page_size: 1 }),
        fetchReservations({ status: "pending,approved", page_size: 1 }),
        fetchReservations({ status: "given,not_returned", page_size: 1 }),
        fetchReservations({ status: "returned", page_size: 1 }),
        fetchReservations({ status: "overdue", page_size: 1 }),
      ]);

      setTabCounts({
        all: allRes?.count ?? (Array.isArray(allRes) ? allRes.length : 0),
        pending: pendingRes?.count ?? (Array.isArray(pendingRes) ? pendingRes.length : 0),
        borrowed: borrowedRes?.count ?? (Array.isArray(borrowedRes) ? borrowedRes.length : 0),
        returned: returnedRes?.count ?? (Array.isArray(returnedRes) ? returnedRes.length : 0),
        overdue: overdueRes?.count ?? (Array.isArray(overdueRes) ? overdueRes.length : 0),
      });
    } catch (err) {
      console.error("Tab counts load error:", err);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchMainPageStats();
        if (res) setStats(res);
      } catch (err) {
        console.error("Stats load error:", err);
      }
    };
    loadStats();
    loadTabCounts();
  }, []);

  // Load Data according to currentTab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (currentTab === "dashboard") {
          const res = await fetchReservations({ status: "pending,approved", search: debouncedSearch });
          const items = res?.results || (Array.isArray(res) ? res : []);
          setReservations(items);
          setResTotalCount(res?.count ?? items.length);
        } else if (currentTab === "reservations") {
          let status = "";
          if (resSubTab === "pending") status = "pending,approved";
          else if (resSubTab === "borrowed") status = "given,not_returned";
          else if (resSubTab === "returned") status = "returned";
          else if (resSubTab === "overdue") status = "overdue";
          else if (resSubTab === "all") status = "";

          const res = await fetchReservations({ status, search: debouncedSearch });
          const items = res?.results || (Array.isArray(res) ? res : []);
          setReservations(items);
          setResTotalCount(res?.count ?? items.length);
        } else if (currentTab === "overdue") {
          const res = await fetchReservations({ status: "given,not_returned", search: debouncedSearch });
          const items = res?.results || (Array.isArray(res) ? res : []);
          setReservations(items);
          setResTotalCount(res?.count ?? items.length);
        } else if (currentTab === "books") {
          const res = await fetchBooks({ search: debouncedSearch, page: fondPage, page_size: fondPageSize });
          setFondBooks(res?.results || (Array.isArray(res) ? res : []));
          setFondTotalCount(res?.count || (Array.isArray(res) ? res.length : 0));
        } else if (currentTab === "users") {
          const res = await fetchUsersList(userRoleFilter || null, 1, debouncedSearch || null);
          const data = res?.data || res;
          setUsersList(data?.results || (Array.isArray(data) ? data : []));
        }
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentTab, resSubTab, userRoleFilter, debouncedSearch, fondPage, fondPageSize]);

  // Reservation Action Handler (Topshirish / Qabul qilish)
  const handleReservationAction = async () => {
    if (!selectedResItem) return;
    try {
      const newStatus = resSubTab === "pending" || currentTab === "dashboard" ? "given" : "returned";
      await updateReservationStatus(selectedResItem.id, { status: newStatus });
      setShowResModal(false);
      setSelectedResItem(null);
      // Reload tab counts & current list
      loadTabCounts();
      let status = "";
      if (resSubTab === "pending") status = "pending,approved";
      else if (resSubTab === "borrowed") status = "given,not_returned";
      else if (resSubTab === "returned") status = "returned";
      else if (resSubTab === "overdue") status = "overdue";

      const res = await fetchReservations({ status, search: debouncedSearch });
      const items = res?.results || (Array.isArray(res) ? res : []);
      setReservations(items);
      setResTotalCount(res?.count ?? items.length);
    } catch (err) {
      alert("Amalni bajarishda xatolik yuz berdi");
    }
  };

  // Delete Book Handler
  const handleDeleteBook = async () => {
    if (!selectedBookToDelete) return;
    try {
      await deleteBook(selectedBookToDelete.id);
      setShowDeleteBookModal(false);
      setSelectedBookToDelete(null);
      const res = await fetchBooks({ page_size: 50 });
      setFondBooks(res?.results || (Array.isArray(res) ? res : []));
    } catch (err) {
      alert("Kitobni o'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-6 md:p-8 2xl:p-10 min-[1920px]:px-12 min-[2560px]:px-16 max-w-[1760px] min-[1920px]:max-w-[2100px] min-[2560px]:max-w-[2600px] mx-auto font-interface flex flex-col gap-6 2xl:gap-8 text-[var(--text-main)] min-h-screen">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col gap-1">
          <h1 className="font-editorial text-2.5xl md:text-3xl font-normal text-[var(--text-main)] capitalize">
            {currentTab === "dashboard" && "Dashboard — kunlik navbat va statistika"}
            {currentTab === "reservations" && "Bandlovlar — tasdiqlash va topshirish"}
            {currentTab === "overdue" && "Muddati o'tgan kitoblar jurnali"}
            {currentTab === "books" && "Kitob fondi — nashrlar katalogi"}
            {currentTab === "users" && "Foydalanuvchilar va rollar boshqaruvi"}
          </h1>
          <span className="text-xs text-[var(--text-subtle)] font-medium">
            Bugun: {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Top Search Input */}
          <div className="relative flex items-center h-10 px-3.5 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl w-64 shadow-xs">
            <CgSearch className="text-gray-400 text-base shrink-0" />
            <input
              type="text"
              placeholder="Qidirish (nom, muallif, user)…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent ml-2 text-xs font-semibold text-[var(--text-main)] placeholder-[#8a93a6] outline-none"
            />
          </div>

          <button
            onClick={() => navigate("/createBook")}
            className="h-10 px-4 rounded-xl bg-[var(--navy-primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
          >
            <FiPlus className="text-sm" /> Kitob qo'shish
          </button>
        </div>
      </div>

      {/* ==================== A1 DASHBOARD VIEW ==================== */}
      {currentTab === "dashboard" && (
        <div className="flex flex-col gap-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f0b64a]" />
                <span className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                  Tasdiqlash navbati
                </span>
              </div>
              <span className="font-editorial text-4xl font-normal text-[var(--text-main)]">
                {tabCounts.pending}
              </span>
              <span className="text-xs text-[var(--text-subtle)] font-medium">Tasdiqlash kutilmoqda</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--navy-primary)]" />
                <span className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                  Qo'ldagi kitoblar
                </span>
              </div>
              <span className="font-editorial text-4xl font-normal text-[var(--text-main)]">
                {tabCounts.borrowed}
              </span>
              <span className="text-xs text-[var(--text-subtle)] font-medium">Talabalarga berilgan</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3f9e5f]" />
                <span className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                  Qaytarilganlar
                </span>
              </div>
              <span className="font-editorial text-4xl font-normal text-[var(--text-main)]">
                {tabCounts.returned}
              </span>
              <span className="text-xs text-[var(--text-subtle)] font-medium">Fondga topshirilgan</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--crimson-primary)]" />
                <span className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                  Muddati o'tgan
                </span>
              </div>
              <span className="font-editorial text-4xl font-normal text-[var(--crimson-primary)]">
                {tabCounts.overdue}
              </span>
              <span className="text-xs text-[var(--text-subtle)] font-medium">Qaytarish muddati o'tgan</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Tasdiqlash Navbati Queue Table */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-xs flex flex-col">
              <div className="p-5 border-b border-[var(--border-main)] bg-[var(--bg-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-sm font-extrabold text-[var(--text-main)]">Tasdiqlash navbati</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--crimson-light)] text-[var(--crimson-primary)] text-[11px] font-extrabold">
                    {reservations.length} ta navbatda
                  </span>
                </div>
                <button
                  onClick={() => navigate("/bookControl?tab=reservations")}
                  className="text-xs font-bold text-[var(--navy-primary)] dark:text-blue-300 hover:underline cursor-pointer"
                >
                  Barchasini ko'rish →
                </button>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-main)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-subtle)]">
                    <tr>
                      <th className="p-4">Kitob</th>
                      <th className="p-4">Foydalanuvchi</th>
                      <th className="p-4">Vaqti</th>
                      <th className="p-4 text-center">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-main)] text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-[var(--navy-primary)] font-bold">
                          Yuklanmoqda...
                        </td>
                      </tr>
                    ) : reservations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-[var(--text-muted)] font-medium">
                          Hozircha navbatda kutilayotgan bandlovlar yo'q
                        </td>
                      </tr>
                    ) : (
                      reservations.slice(0, 6).map((item) => (
                        <tr key={item.id} className="hover:bg-[var(--bg-subtle)] transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item?.img ? (
                                <img src={item.img} alt="" className="w-8 h-11 rounded object-cover shrink-0" />
                              ) : (
                                <div className="w-8 h-11 rounded bg-gradient-to-br from-[#3d6cb0] to-[#1b3f7a] shrink-0" />
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-[var(--text-main)] text-xs truncate max-w-[180px]">
                                  {item?.book}
                                </span>
                                <span className="text-[11px] text-[var(--text-subtle)] truncate max-w-[180px]">
                                  {Array.isArray(item?.author) ? item.author.map((a) => a.name || a).join(", ") : item?.author}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[var(--navy-light)] text-[var(--navy-primary)] text-[10px] font-extrabold flex items-center justify-center">
                                <FiUser />
                              </div>
                              <span className="font-semibold text-[var(--text-main)] truncate max-w-[140px]">
                                {item?.first_name || item?.user || "Talaba"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-[var(--text-muted)] font-medium">
                            {formatDateReadable(item?.approved_at || item?.created_at)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedResItem(item);
                                setShowResModal(true);
                              }}
                              className="h-8 px-3 rounded-lg bg-[var(--navy-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer inline-flex items-center gap-1"
                            >
                              <FiBookOpen /> Topshirish
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Overdue alert & Weekly Activity */}
            <div className="flex flex-col gap-6">
              {/* Overdue alert box */}
              <div className="bg-[var(--bg-card)] border border-[#f2ddb4] rounded-2xl p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-[#a8760c] text-lg" />
                    <h3 className="text-sm font-extrabold text-[var(--text-main)]">Muddati o'tganlar ({tabCounts.overdue})</h3>
                  </div>
                  <button
                    onClick={() => navigate("/bookControl?tab=overdue")}
                    className="text-xs font-bold text-[#a8760c] hover:underline cursor-pointer"
                  >
                    Barchasi →
                  </button>
                </div>
                <div className="flex flex-col gap-2 border-t border-[var(--border-main)] pt-3 text-xs">
                  <div className="flex items-center justify-between bg-[var(--bg-subtle)] p-2.5 rounded-xl border border-[var(--border-main)]">
                    <div className="flex flex-col">
                      <span className="font-bold text-[var(--text-main)]">Odam anatomiyasi</span>
                      <span className="text-[11px] text-[var(--text-subtle)]">Jasur Alimov</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[var(--crimson-light)] text-[var(--crimson-primary)] font-extrabold text-[11px]">
                      3 kun o'tgan
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Activity graph widget */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[var(--text-main)] flex items-center gap-2">
                    <FiBarChart2 className="text-[var(--navy-primary)]" /> Haftalik faollik
                  </h3>
                  <span className="text-xs text-[var(--text-subtle)] font-bold">So'nggi 7 kun</span>
                </div>

                <div className="flex items-flex-end gap-3 h-28 pt-4">
                  {[
                    { day: "Dush", val: 34, h: "60%" },
                    { day: "Sesh", val: 48, h: "85%" },
                    { day: "Chor", val: 52, h: "95%" },
                    { day: "Pay", val: 40, h: "75%" },
                    { day: "Jum", val: 38, h: "70%" },
                    { day: "Shan", val: 18, h: "35%" },
                    { day: "Yak", val: 12, h: "25%" },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-extrabold text-[var(--text-main)]">{bar.val}</span>
                      <div className="w-full bg-[var(--navy-primary)] rounded-t-md transition-all duration-300" style={{ height: bar.h }} />
                      <span className="text-[10px] font-bold text-[var(--text-subtle)]">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== A2 BANDLOVLAR VIEW ==================== */}
      {currentTab === "reservations" && (
        <div className="flex flex-col gap-5">
          {/* Subtabs with design badges & Excel button */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-main)] p-1.5 rounded-2xl shadow-xs">
              {[
                { key: "all", label: "Barchasi", count: tabCounts.all },
                { key: "pending", label: "Band qilingan", count: tabCounts.pending },
                { key: "borrowed", label: "Berilgan (Qo'lda)", count: tabCounts.borrowed },
                { key: "returned", label: "Qaytarilgan", count: tabCounts.returned },
                { key: "overdue", label: "Muddati o'tgan", count: tabCounts.overdue },
              ].map((tab) => {
                const isActive = resSubTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setResSubTab(tab.key);
                      setSelectedResIds([]);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-[var(--navy-primary)] text-white shadow-xs"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--bg-subtle)] text-[var(--text-subtle)]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => alert("Excel fayliga eksport qilinmoqda...")}
              className="h-10 px-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] text-xs font-bold hover:bg-[var(--bg-subtle)] transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <FiDownload className="text-sm" /> Excel fayl
            </button>
          </div>

          {/* Bulk Selection Action Bar */}
          {selectedResIds.length > 0 && (
            <div className="flex items-center justify-between gap-4 bg-[var(--navy-primary)] text-white rounded-2xl px-5 py-3.5 shadow-md animate-in fade-in duration-200">
              <span className="text-xs font-bold tracking-wide">
                <b>{selectedResIds.length}</b> ta bandlov tanlandi
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    alert(`${selectedResIds.length} ta bandlov topshirildi`);
                    setSelectedResIds([]);
                  }}
                  className="h-9 px-4 rounded-xl bg-white text-[var(--navy-primary)] text-xs font-extrabold shadow-xs hover:bg-gray-100 transition cursor-pointer"
                >
                  Barchasini topshirish
                </button>
                <button
                  onClick={() => {
                    alert(`${selectedResIds.length} ta bandlov rad etildi`);
                    setSelectedResIds([]);
                  }}
                  className="h-9 px-4 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-extrabold hover:bg-white/25 transition cursor-pointer"
                >
                  Rad etish
                </button>
                <button
                  onClick={() => setSelectedResIds([])}
                  className="text-xs font-bold text-blue-200 hover:text-white transition cursor-pointer ml-2"
                >
                  Tanlovni bekor qilish
                </button>
              </div>
            </div>
          )}

          {/* Reservations Data Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-main)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-subtle)]">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={reservations.length > 0 && selectedResIds.length === reservations.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResIds(reservations.map((r) => r.id));
                          } else {
                            setSelectedResIds([]);
                          }
                        }}
                        className="w-4 h-4 rounded accent-[var(--navy-primary)] cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Kitob</th>
                    <th className="p-4">Foydalanuvchi</th>
                    <th className="p-4">Band sanasi</th>
                    <th className="p-4">Muddat</th>
                    <th className="p-4 text-center">Holat</th>
                    <th className="p-4 text-center">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-main)] text-xs font-interface">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-10 text-center text-[var(--navy-primary)] font-bold">
                        Bandlovlar yuklanmoqda...
                      </td>
                    </tr>
                  ) : reservations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-10 text-center text-[var(--text-muted)] font-medium">
                        Ushbu toifa bo'yicha bandlovlar mavjud emas
                      </td>
                    </tr>
                  ) : (
                    reservations.map((item) => {
                      const isSelected = selectedResIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`transition ${
                            isSelected ? "bg-[var(--navy-light)]/40" : "hover:bg-[var(--bg-subtle)]"
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedResIds([...selectedResIds, item.id]);
                                } else {
                                  setSelectedResIds(selectedResIds.filter((id) => id !== item.id));
                                }
                              }}
                              className="w-4 h-4 rounded accent-[var(--navy-primary)] cursor-pointer"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item?.img ? (
                                <img src={item.img} alt="" className="w-9 h-12 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="w-9 h-12 rounded-lg bg-gradient-to-br from-[#3d6cb0] to-[#1b3f7a] shrink-0" />
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-[var(--text-main)] text-xs truncate max-w-[220px]">
                                  {item?.book || item?.title || "Nashr nomi"}
                                </span>
                                <span className="text-[11px] text-[var(--text-subtle)] truncate max-w-[200px]">
                                  {Array.isArray(item?.author)
                                    ? item.author.map((a) => (typeof a === "object" ? a.name || a.sortingname : a)).join(", ")
                                    : item?.author || "Muallif"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[var(--navy-light)] text-[var(--navy-primary)] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                {(item?.first_name ? item.first_name[0] : item?.user ? item.user[0] : "T").toUpperCase()}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-[var(--text-main)] truncate max-w-[150px]">
                                  {item?.first_name ? `${item.first_name} ${item.last_name || ""}` : item?.user || "Talaba"}
                                </span>
                                <span className="text-[11px] text-[var(--text-subtle)] font-medium">Talaba · HEMIS</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-[var(--text-muted)] font-medium">
                            {formatDateReadable(item?.approved_at || item?.created_at || item?.reserved_from)}
                          </td>
                          <td className="p-4 text-[var(--text-muted)] font-medium">
                            {formatDateReadable(item?.reserved_until) || "14 kun"}
                          </td>
                          <td className="p-4 text-center">
                            {resSubTab === "pending" && (
                              <span className="px-2.5 py-1 rounded-md font-extrabold text-[10.5px] bg-[#fff8ec] border border-[#f2ddb4] text-[#8a6413]">
                                Kutilmoqda
                              </span>
                            )}
                            {resSubTab === "borrowed" && (
                              <span className="px-2.5 py-1 rounded-md font-extrabold text-[10.5px] bg-[var(--navy-light)] border border-[var(--navy-primary)]/20 text-[var(--navy-primary)] dark:text-white">
                                Berilgan (Qo'lda)
                              </span>
                            )}
                            {resSubTab === "returned" && (
                              <span className="px-2.5 py-1 rounded-md font-extrabold text-[10.5px] bg-[#eef7f0] border border-[#a8e0b5] text-[#1f5c36]">
                                Qaytarilgan
                              </span>
                            )}
                            {resSubTab === "overdue" && (
                              <span className="px-2.5 py-1 rounded-md font-extrabold text-[10.5px] bg-[var(--crimson-light)] border border-[var(--crimson-border)] text-[var(--crimson-primary)]">
                                Muddati o'tgan
                              </span>
                            )}
                            {resSubTab === "all" && (
                              <span className="px-2.5 py-1 rounded-md font-extrabold text-[10.5px] bg-[var(--bg-subtle)] border border-[var(--border-main)] text-[var(--text-main)]">
                                {item?.status || "Aktiv"}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedResItem(item);
                                  setShowResModal(true);
                                }}
                                className="h-8 px-3.5 rounded-xl bg-[var(--navy-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                              >
                                {resSubTab === "borrowed" ? "Qabul qilish" : "Topshirish"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-[var(--bg-subtle)] border-t border-[var(--border-main)] flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-[var(--text-muted)]">
              <span>
                Ko'rsatilmoqda: <b className="text-[var(--text-main)]">{reservations.length > 0 ? `1–${reservations.length}` : '0'}</b> / {resTotalCount} ta bandlov
              </span>
              <div className="flex items-center gap-1.5">
                <button disabled className="h-8 px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] font-bold opacity-50 cursor-not-allowed">
                  ‹ Oldingi
                </button>
                <button className="h-8 w-8 rounded-lg bg-[var(--navy-primary)] text-white font-extrabold text-xs shadow-xs">
                  1
                </button>
                <button className="h-8 w-8 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] font-bold hover:bg-[var(--navy-light)]">
                  2
                </button>
                <button className="h-8 px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] font-bold hover:bg-[var(--navy-light)] transition cursor-pointer">
                  Keyingi ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== A3 KITOB FONDI VIEW ==================== */}
      {currentTab === "books" && (
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-main)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-subtle)]">
                <tr>
                  <th className="p-4">Kitob</th>
                  <th className="p-4">Muallif</th>
                  <th className="p-4">Bo'lim</th>
                  <th className="p-4">Format</th>
                  <th className="p-4">Nusxa</th>
                  <th className="p-4">Reyting</th>
                  <th className="p-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[var(--navy-primary)] font-bold">
                      Kitob fondi yuklanmoqda...
                    </td>
                  </tr>
                ) : fondBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[var(--text-muted)] font-medium">
                      Kitoblar topilmadi
                    </td>
                  </tr>
                ) : (
                  fondBooks.map((b) => (
                    <tr key={b.id} className="hover:bg-[var(--bg-subtle)] transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {b?.img ? (
                            <img src={b.img} alt="" className="w-8 h-11 rounded object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-11 rounded bg-gradient-to-br from-[#3d6cb0] to-[#1b3f7a] shrink-0" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-main)] text-xs">{b?.name}</span>
                            <span className="text-[11px] text-[var(--text-subtle)]">ISBN: {b?.isbn || "---"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-[var(--text-main)]">
                        {Array.isArray(b?.author)
                          ? b.author.map((a) => (typeof a === "object" ? a.name || a.sortingname : a)).join(", ")
                          : b?.author || "Noma'lum"}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--navy-light)] text-[var(--navy-primary)] dark:text-white text-[11px] font-bold">
                          {b?.category?.name || "Tibbiyot"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {b?.file_pdf && (
                            <span className="px-1.5 py-0.5 rounded bg-[var(--orange-pdf-bg)] text-[var(--orange-pdf)] font-extrabold text-[10px]">
                              PDF
                            </span>
                          )}
                          {b?.file_audio && (
                            <span className="px-1.5 py-0.5 rounded bg-[var(--crimson-light)] text-[var(--crimson-primary)] font-extrabold text-[10px]">
                              AUDIO
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-[var(--navy-light)] text-[var(--navy-primary)] font-extrabold text-[10px]">
                            FIZIK
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[var(--text-main)]">{b?.quantity || 24}</td>
                      <td className="p-4 font-bold text-[var(--text-main)]">★ {b?.rating || "4.8"}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/books/${b.id}/edit`)}
                            className="p-1.5 rounded-lg border border-[var(--border-main)] text-[var(--navy-primary)] dark:text-blue-300 hover:bg-[var(--navy-light)] transition cursor-pointer"
                            title="Tahrirlash"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBookToDelete(b);
                              setShowDeleteBookModal(true);
                            }}
                            className="p-1.5 rounded-lg border border-[var(--crimson-border)] text-[var(--crimson-primary)] hover:bg-[var(--crimson-light)] transition cursor-pointer"
                            title="O'chirish"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination & Page Size Control Footer */}
            <div className="p-4 bg-[var(--bg-subtle)] border-t border-[var(--border-main)] flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span>Ko'rsatish:</span>
                <select
                  value={fondPageSize}
                  onChange={(e) => {
                    setFondPageSize(Number(e.target.value));
                    setFondPage(1);
                  }}
                  className="h-8 px-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] font-bold outline-none cursor-pointer"
                >
                  <option value={10}>10 ta</option>
                  <option value={25}>25 ta</option>
                  <option value={50}>50 ta</option>
                  <option value={100}>100 ta</option>
                </select>
                <span>
                  Jami: <b className="text-[var(--text-main)]">{fondTotalCount}</b> ta nashr (
                  {fondTotalCount > 0 ? (fondPage - 1) * fondPageSize + 1 : 0}–
                  {Math.min(fondPage * fondPageSize, fondTotalCount)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={fondPage <= 1}
                  onClick={() => setFondPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] font-bold disabled:opacity-40 hover:bg-[var(--navy-light)] transition cursor-pointer"
                >
                  ‹ Oldingi
                </button>

                {Array.from({ length: Math.ceil(fondTotalCount / fondPageSize) || 1 }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === Math.ceil(fondTotalCount / fondPageSize) || Math.abs(p - fondPage) <= 2)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-[var(--text-subtle)]">…</span>}
                      <button
                        onClick={() => setFondPage(p)}
                        className={`h-8 w-8 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                          fondPage === p
                            ? "bg-[var(--navy-primary)] text-white shadow-xs"
                            : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--navy-light)]"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  disabled={fondPage * fondPageSize >= fondTotalCount}
                  onClick={() => setFondPage((p) => p + 1)}
                  className="h-8 px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] font-bold disabled:opacity-40 hover:bg-[var(--navy-light)] transition cursor-pointer"
                >
                  Keyingi ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== A5 FOYDALANUVCHILAR VIEW ==================== */}
      {currentTab === "users" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-main)] p-1 rounded-xl">
              {[
                { key: "", label: "Barchasi" },
                { key: "student", label: "Talaba" },
                { key: "teacher", label: "O'qituvchi" },
                { key: "librarian", label: "Kutubxonachi" },
                { key: "admin", label: "Admin" },
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => setUserRoleFilter(r.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                    userRoleFilter === r.key
                      ? "bg-[var(--navy-primary)] text-white shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-main)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-subtle)]">
                <tr>
                  <th className="p-4">Foydalanuvchi</th>
                  <th className="p-4">Aloqa</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4 text-center">Holat</th>
                  <th className="p-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[var(--navy-primary)] font-bold">
                      Foydalanuvchilar yuklanmoqda...
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[var(--text-muted)] font-medium">
                      Foydalanuvchilar topilmadi
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--bg-subtle)] transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--navy-primary)] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.first_name ? u.first_name[0] : "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-main)] text-xs">
                              {u.first_name ? `${u.first_name} ${u.last_name || ""}` : u.username}
                            </span>
                            <span className="text-[11px] text-[var(--text-subtle)]">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-[var(--text-main)]">{u.email || u.username}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--navy-light)] text-[var(--navy-primary)] dark:text-white font-extrabold text-[11px] capitalize">
                          {u.role || "Talaba"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3f9e5f]">
                          <span className="w-2 h-2 rounded-full bg-[#3f9e5f]" /> Aktiv
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => navigate("/user-logs")}
                          className="h-8 px-3 rounded-lg border border-[var(--border-main)] text-xs font-bold text-[var(--navy-primary)] dark:text-blue-300 hover:bg-[var(--navy-light)] transition cursor-pointer"
                        >
                          Tarix
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reservation */}
      <Modal
        isOpen={showResModal}
        onClose={() => setShowResModal(false)}
        title={resSubTab === "pending" || currentTab === "dashboard" ? "Kitobni topshirishni tasdiqlash" : "Kitobni qabul qilish"}
      >
        <div className="flex flex-col gap-4 font-interface text-[var(--text-main)]">
          {/* Book Summary Box */}
          <div className="flex items-center gap-3 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-3">
            <div className="w-10 h-14 rounded-md bg-gradient-to-br from-[#3d6cb0] to-[#1b3f7a] shrink-0 overflow-hidden relative">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--crimson-primary)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-[var(--text-main)] truncate">
                {selectedResItem?.book || selectedResItem?.title || "Nashr nomi"}
              </span>
              <span className="text-[11px] text-[var(--text-subtle)] truncate">
                {Array.isArray(selectedResItem?.author)
                  ? selectedResItem.author.map((a) => (typeof a === "object" ? a.name || a.sortingname : a)).join(", ")
                  : selectedResItem?.author || "Muallif"}
              </span>
              <span className="text-[10px] font-extrabold text-[#1f5c36] bg-[#eef7f0] px-1.5 py-0.5 rounded self-start mt-1">
                24 nusxa mavjud
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between text-xs border-b border-[var(--border-main)] pb-2.5">
            <span className="text-[var(--text-subtle)] font-medium">Foydalanuvchi:</span>
            <span className="font-bold text-[var(--text-main)]">
              {selectedResItem?.first_name ? `${selectedResItem.first_name} ${selectedResItem.last_name || ""}` : selectedResItem?.user || "Talaba"}
            </span>
          </div>

          {/* Return Duration Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--text-main)]">Qaytarish muddati</label>
            <div className="grid grid-cols-3 gap-2">
              {["14 kun", "30 kun", "Semestr"].map((duration, idx) => (
                <button
                  key={duration}
                  type="button"
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    idx === 0
                      ? "bg-[var(--navy-primary)] text-white border-[var(--navy-primary)] shadow-xs"
                      : "bg-[var(--bg-subtle)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-main)]">Izoh (ixtiyoriy)</label>
            <textarea
              placeholder="Masalan: kitob muqovasi shikastlanmagan..."
              className="w-full h-20 p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] text-xs font-medium outline-none focus:border-[var(--navy-primary)]"
            />
          </div>

          <div className="flex gap-3 mt-2 pt-2 border-t border-[var(--border-main)]">
            <button
              onClick={() => setShowResModal(false)}
              className="flex-1 h-11 rounded-xl border border-[var(--border-main)] text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleReservationAction}
              className="flex-2 h-11 rounded-xl bg-[var(--crimson-primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              Topshirishni tasdiqlash
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Book Modal */}
      <Modal
        isOpen={showDeleteBookModal}
        onClose={() => setShowDeleteBookModal(false)}
        title="Kitobni o'chirish"
      >
        <div className="flex flex-col gap-4 font-interface text-[var(--text-main)]">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Rostdan ham <b className="text-[var(--text-main)]">{selectedBookToDelete?.name}</b> kitobini o'chirishni xohlaysizmi?
          </p>

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setShowDeleteBookModal(false)}
              className="px-4 h-10 rounded-xl border border-[var(--border-main)] text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleDeleteBook}
              className="px-4 h-10 rounded-xl bg-[var(--crimson-primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              Ha, o'chirish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}