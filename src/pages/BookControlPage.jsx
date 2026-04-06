import React, { useState, useEffect } from "react";
import { CgSearch } from "react-icons/cg";
import { FiUser, FiClock, FiCheckCircle, FiBookOpen, FiX } from "react-icons/fi";
import { 
  fetchReservations, 
  updateReservationStatus 
} from "../services/reservations";
import { fetchMainPageStats } from "../services/additional";
import { Link } from "react-router";


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
      const newStatus = activeTab === "pending" ? "borrowed" : "returned";
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
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans text-[#143c7b]">
      <div className="bg-[#f2f4f7] py-3">
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
              className="w-full bg-white border border-[#d1d9e6] rounded-xl py-3 pl-11 pr-4 focus:outline-none shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CgSearch className="absolute left-4 top-3.5 text-xl text-gray-400" />
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <StatChip icon={<FiClock />} label={`${stats.pending_count || 0} band`} color="text-red-600" borderColor="border-red-200" />
            <StatChip icon={<FiBookOpen />} label={`${stats.borrowed_count || 0} topshirilgan`} color="text-[#143c7b]" borderColor="border-blue-200" />
            <StatChip icon={<FiCheckCircle />} label={`${stats.returned_count || 0} qaytarilgan`} color="text-green-600" borderColor="border-green-200" />
          </div>
        </div>

        {/* TABS */}
        <div className="bg-[#eef2f7] p-1.5 rounded-2xl inline-flex mb-8 border border-[#d1d9e6]">
          <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} label="Band qilingan" />
          <TabButton active={activeTab === "borrowed"} onClick={() => setActiveTab("borrowed")} label="Berilgan" />
          <TabButton active={activeTab === "returned"} onClick={() => setActiveTab("returned")} label="Qaytarilgan" />
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#143c7b] rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
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
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center">Yuklanmoqda...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center">Ma'lumot topilmadi</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img src={item?.img || "placeholder.jpg"} className="w-10 h-14 rounded-md object-cover" />
                      <div>
                        <div className="font-bold text-sm max-w-36">{item?.book}</div>
                        <div className="text-[11px] text-gray-500">{item?.author.map(a => a.name + " ")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><FiUser /></div>
                      <span className="text-sm font-medium">{(item?.first_name +" "+item?.last_name) !== " " || item?.user}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-[#5174ac]">{activeTab === "pending" ? formatDateReadable(item?.approved_at) : formatDateReadable(item?.reserved_from)}</td>
                  {activeTab !== "pending" && <td className="p-5 text-sm text-[#5174ac]">{formatDateReadable(item?.reserved_until) || "---"}</td>}
                  <td className="p-5 text-center">
                    <span className="px-4 py-1.5 border border-blue-200 rounded-lg text-[11px] font-bold">
                      {activeTab === "pending" ? "Band qilingan" : activeTab === "borrowed" ? "Topshirilgan" : "Qaytarilgan"}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {activeTab !== "returned" && (
                      <button 
                        onClick={() => { setSelectedItem(item); setShowModal(true); }}
                        className="bg-[#003282] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 transition flex items-center gap-2 mx-auto"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500"><FiX className="text-xl" /></button>
            <h2 className="text-xl font-bold text-[#143c7b] mb-2">{activeTab === "pending" ? "Kitobni topshirish" : "Kitobni qabul qilish"}</h2>
            <p className="text-sm text-gray-500 mb-6">Foydalanuvchi: {selectedItem?.user_details?.full_name}</p>
            
            {activeTab === "pending" && (
              <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-[#143c7b]">Qaytarish muddati *</label>
                <input 
                  type="date" 
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl py-3 px-4 outline-none"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-500">Bekor qilish</button>
              <button onClick={handleAction} className="flex-1 bg-[#003282] text-white py-3 rounded-xl text-sm font-bold shadow-lg">Tasdiqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Yordamchi kichik komponentlar
const StatChip = ({ icon, label, color, borderColor }) => (
  <div className={`flex items-center gap-2 bg-white border ${borderColor} px-4 py-2 rounded-xl text-xs font-bold ${color} shadow-sm`}>
    {icon} {label}
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition ${active ? "bg-white shadow-md text-[#143c7b]" : "text-gray-500 hover:text-[#143c7b]"}`}
  >
    {label}
  </button>
);