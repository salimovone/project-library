import { useState, useEffect } from "react";
import { FaHistory, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchBookActionLogs } from "../../../services/auditLogs";

const actionTranslations = {
  'UPDATE': 'yangiladi',
  'CREATE': 'yaratdi',
  'DELETE': "o'chirdi",
};

const LogItem = ({ log, isExpanded, onToggle }) => {
  const actionText = actionTranslations[log.action?.toUpperCase()] || log.action_display || log.action;

  const getBookName = (desc) => {
      if (!desc) return '';
      const match = desc.match(/kitob:\s*(.*)/i);
      return match ? match[1].split('\n')[0].trim() : '';
  };
  const bookName = getBookName(log.description);

  return (
    <div 
        className="border-l-2 border-blue-500 pl-4 py-2 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
        onClick={onToggle}
    >
      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-2.5 border-2 border-white dark:border-[#1e1e1e]"></div>
      <div className="flex justify-between items-start gap-4">
        <div className="overflow-hidden">
          <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200 flex items-center flex-wrap gap-x-1">
            <span className="font-bold text-blue-600 dark:text-blue-400">{log.user_username || "Foydalanuvchi"}</span> <span className="lowercase font-semibold">{actionText}</span>
            {bookName && <span className="text-gray-700 dark:text-gray-300 font-normal truncate max-w-[150px] sm:max-w-[200px]">"{bookName}"</span>}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {new Date(log.timestamp).toLocaleString("uz-UZ", {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="mt-1 shrink-0">
          {isExpanded ? <FaChevronUp className="text-gray-400 text-sm" /> : <FaChevronDown className="text-gray-400 text-sm" />}
        </div>
      </div>
      
      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
            <div className="p-3 bg-white dark:bg-[#2a2a2a] rounded-lg border border-gray-100 dark:border-gray-800 text-sm shadow-sm" onClick={(e) => e.stopPropagation()}>
                {log.description && (
                    <div className="mb-2">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Tavsif:</p>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{log.description}</p>
                    </div>
                )}
                {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="mt-3">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">O'zgarishlar:</p>
                        <div className="space-y-2">
                            {Object.entries(log.changes).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 dark:bg-[#1e1e1e] p-2 rounded border border-gray-100 dark:border-gray-700">
                                    <span className="font-medium text-gray-800 dark:text-gray-200 block mb-1">{key}:</span> 
                                    <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-2">
                                      <div className="bg-red-50 dark:bg-red-900/20 p-1 rounded break-all">
                                        <span className="text-red-500 font-semibold mr-1">-</span>
                                        {value.old === null || value.old === "" ? <span className="italic opacity-50">bo'sh</span> : String(value.old)}
                                      </div>
                                      <div className="bg-green-50 dark:bg-green-900/20 p-1 rounded break-all">
                                        <span className="text-green-500 font-semibold mr-1">+</span>
                                        {value.new === null || value.new === "" ? <span className="italic opacity-50">bo'sh</span> : String(value.new)}
                                      </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 dark:border-gray-700 pt-2">
                   {log.ip_address && <span>IP: {log.ip_address}</span>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default function BookHistoryCard({ book }) {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState(null);

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
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-6 transition-colors duration-300 mb-6">
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

      <div className="space-y-2 ml-2">
        {displayedLogs.map((log) => (
          <LogItem 
              key={log.id} 
              log={log} 
              isExpanded={expandedLogId === log.id}
              onToggle={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
          />
        ))}
      </div>
    </div>
  );
}
