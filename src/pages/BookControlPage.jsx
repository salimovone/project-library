import React, { useState, useEffect } from "react";
import { CgSearch } from "react-icons/cg";
import { FiUser, FiClock, FiCheckCircle, FiBookOpen, FiX } from "react-icons/fi";
import {
  fetchReservations,
  updateReservationStatus
} from "../services/reservations";
import { fetchMainPageStats } from "../services/additional";
import { Link } from "react-router";
import Modal from "../components/Modal";


const formatDateReadable = (date) => {

  return new Date(!!date ? date : new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function BookControlPage() {
  const [activeTab, setActiveTab] = useState("pending"); // pending, borrowed, returned
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnDate, setReturnDate] = useState("");

  // Ma'lumotlarni yuklash
  const loadData = async () => {
    setLoading(true);
    let status = ""
    switch (activeTab) {
      case "pending":
        status = "pending,approved";
        break;
      case "borrowed":
        status = "given,not_returned";
        break;
      case "returned":
        status = "returned";
        break;
      default:
        setData([]);
        setLoading(false);
        return;
    }
    try {
      let params = { status };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const res = await fetchReservations(params);
      setData(res.results || []);

      const statRes = await fetchMainPageStats();
      setStats(statRes);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, searchTerm]);

  // Statusni o'zgartirish (Topshirish yoki Qabul qilish)
  const handleAction = async () => {
    if (!selectedItem) return;

    try {
      const newStatus = activeTab === "pending" ? "given" : "returned";
      const payload = {
        status: newStatus,
        ...(returnDate && { return_date: returnDate })
      };

      await updateReservationStatus(selectedItem.id, payload);
      setShowModal(false);
      setSelectedItem(null);
      loadData(); // Ro'yxatni yangilash
    } catch (err) {
      alert("Amalni bajarishda xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pb-20 font-sans text-[#143c7b] dark:text-blue-300 transition-colors duration-300">
      <div className="bg-[#f2f4f7] dark:bg-[#1a1a1a] py-3 transition-colors duration-300">
        <div className="custom-container mx-auto px-4 text-sm font-medium">
          <Link to="/">Home</Link> / Book Control
        </div>
      </div>

      <div className="custom-container mx-auto px-4 mt-8 max-w-6xl">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Kitob yoki foydalanuvchi qidirish..."
              className="w-full bg-white dark:bg-[#1e1e1e] border border-[#d1d9e6] dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none shadow-sm text-sm dark:text-gray-100 dark:placeholder-gray-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CgSearch className="absolute left-4 top-3.5 text-xl text-gray-400" />
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <StatChip icon={<FiClock />} label={`${stats.pending_count || 0} band`} color="text-red-600 dark:text-red-400" borderColor="border-red-200 dark:border-red-900/50" />
            <StatChip icon={<FiBookOpen />} label={`${stats.borrowed_count || 0} topshirilgan`} color="text-[#143c7b] dark:text-blue-400" borderColor="border-blue-200 dark:border-blue-900/50" />
            <StatChip icon={<FiCheckCircle />} label={`${stats.returned_count || 0} qaytarilgan`} color="text-green-600 dark:text-green-400" borderColor="border-green-200 dark:border-green-900/50" />
          </div>
        </div>

        {/* TABS */}
        <div className="bg-[#eef2f7] dark:bg-[#252525] p-1.5 rounded-2xl inline-flex mb-8 border border-[#d1d9e6] dark:border-gray-700 transition-colors">
          <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} label="Band qilingan" />
          <TabButton active={activeTab === "borrowed"} onClick={() => setActiveTab("borrowed")} label="Berilgan" />
          <TabButton active={activeTab === "returned"} onClick={() => setActiveTab("returned")} label="Qaytarilgan" />
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-[#143c7b] dark:border-blue-900/50 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-[#2a2a2a] border-b border-gray-100 dark:border-gray-800 transition-colors">
              <tr>
                <th className="p-5 text-sm font-bold">Kitob</th>
                <th className="p-5 text-sm font-bold">Foydalanuvchi</th>
                <th className="p-5 text-sm font-bold">{activeTab === "pending" ? "Band sanasi" : "Topshirilgan"}</th>
                {activeTab !== "pending" && <th className="p-5 text-sm font-bold">{activeTab === "borrowed" ? "Muddat" : "Qaytarilgan"}</th>}
                <th className="p-5 text-sm font-bold text-center">Holat</th>
                {activeTab !== "returned" && <th className="p-5 text-sm font-bold text-center">Amal</th>}
                {/* <th className="p-5 text-sm font-bold text-center">Amal</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center">Yuklanmoqda...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center">Ma'lumot topilmadi</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {item?.img ? (
                        <img src={item.img} alt={item.book} className="w-10 h-14 rounded-md object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-14 rounded-md bg-linear-to-br from-[#003366] to-[#1a478e] flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse bg-repeat"></div>
                          <span className="text-[8px] font-bold text-white leading-tight line-clamp-3 relative z-10 text-center wrap-break-word px-0.5" title={item?.book}>{item?.book}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm max-w-36 text-[#143c7b] dark:text-blue-300 transition-colors">{item?.book}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors">{item?.author.map(a => a.name + " ")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors"><FiUser /></div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">{(item?.first_name + " " + item?.last_name) !== " " || item?.user}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-[#5174ac]">{activeTab === "pending" ? formatDateReadable(item?.approved_at) : formatDateReadable(item?.reserved_from)}</td>
                  {activeTab !== "pending" && <td className="p-5 text-sm text-[#5174ac]">{formatDateReadable(item?.reserved_until) || "---"}</td>}
                  <td className="p-5 text-center">
                    <span className="px-4 py-1.5 border border-blue-200 dark:border-blue-800/50 rounded-lg text-[11px] font-bold dark:text-blue-400 transition-colors">
                      {activeTab === "pending" ? "Band qilingan" : activeTab === "borrowed" ? "Topshirilgan" : "Qaytarilgan"}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {activeTab !== "returned" && (
                      <button
                        onClick={() => { setSelectedItem(item); setShowModal(true); }}
                        className="bg-[#003282] dark:bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 dark:hover:bg-blue-500 transition flex items-center gap-2 mx-auto"
                      >
                        {activeTab === "pending" ? <><FiBookOpen /> Topshirish</> : <><FiCheckCircle /> Qabul qilish</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={activeTab === "pending" ? "Kitobni topshirish" : "Kitobni qabul qilish"}>
        <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500"><FiX className="text-xl" /></button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">Foydalanuvchi: {selectedItem?.user_details?.first_name} {selectedItem?.user_details?.last_name}</p>

        <div className="flex gap-4">
          <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 dark:border-gray-700 py-3 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">Bekor qilish</button>
          <button onClick={handleAction} className="flex-1 bg-[#003282] dark:bg-blue-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-900 dark:hover:bg-blue-500 transition-colors">Tasdiqlash</button>
        </div>
      </Modal>
    </div>
  );
}

// Yordamchi kichik komponentlar
const StatChip = ({ icon, label, color, borderColor }) => (
  <div className={`flex items-center gap-2 bg-white dark:bg-[#1e1e1e] border ${borderColor} px-4 py-2 rounded-xl text-xs font-bold ${color} shadow-sm transition-colors`}>
    {icon} {label}
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition-colors ${active ? "bg-white dark:bg-[#1e1e1e] shadow-md text-[#143c7b] dark:text-blue-300" : "text-gray-500 dark:text-gray-400 hover:text-[#143c7b] dark:hover:text-blue-300"}`}
  >
    {label}
  </button>
);