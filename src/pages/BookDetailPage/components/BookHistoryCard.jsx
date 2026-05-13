import { useState, useEffect } from "react";
import { FaHistory, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchBookActionLogs } from "../../../services/auditLogs";

export default function BookHistoryCard({ book }) {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetchBookActionLogs(book.id);
        const data = response?.data || response; // API formatiga qarab
        if (Array.isArray(data)) {
            setLogs(data);
        } else if (data && data.results) {
            setLogs(data.results);
        } else {
            setLogs([]);
        }
      } catch (error) {
        console.error("Tarixni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [book.id]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-6 transition-colors duration-300">
         <div className="animate-pulse flex space-x-4">
           <div className="flex-1 space-y-4 py-1">
             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
             <div className="space-y-2">
               <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
               <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
             </div>
           </div>
         </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) return null;

  const latestLog = logs[0];
  const displayedLogs = isExpanded ? logs : [latestLog];

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaHistory className="text-blue-600 dark:text-blue-400" /> Tarix
        </h3>
        {logs.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {isExpanded ? "Qisqartirish" : "Barchasini ko'rish"}
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      <div className="space-y-4 ml-2">
        {displayedLogs.map((log) => (
          <div key={log.id} className="border-l-2 border-blue-500 pl-4 py-1 relative">
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white dark:border-[#1e1e1e]"></div>
            <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200">
              <span className="font-bold text-blue-600 dark:text-blue-400">{log.user_username || "Foydalanuvchi"}</span> kitobni <span className="lowercase font-semibold">{log.action_display || log.action}</span> qildi.
            </p>
            {log.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                {log.description}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
              {new Date(log.timestamp).toLocaleString("uz-UZ", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
