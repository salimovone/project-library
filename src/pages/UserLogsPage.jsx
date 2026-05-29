import { useState, useEffect } from "react";
import { fetchUsersList } from "../services/userService";
import { fetchUserActionHistory } from "../services/auditLogs";
import { FaUser, FaHistory, FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, FaSearch } from "react-icons/fa";

import { Link } from "react-router";

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
                        Foydalanuvchi <span className="font-bold text-blue-600 dark:text-blue-400 lowercase">{actionText}</span>
                        {log.model_name && <span className="text-gray-500 dark:text-gray-400 font-normal">({log.model_name})</span>}
                        {bookName && <span className="text-gray-700 dark:text-gray-300 font-semibold truncate max-w-[150px] sm:max-w-[200px]">"{bookName}"</span>}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <FaHistory className="text-[10px]" />
                        {new Date(log.timestamp).toLocaleString("uz-UZ", {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
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
                        <div className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 dark:border-gray-700 pt-2 items-center justify-between">
                            {log.ip_address && <span>IP: {log.ip_address}</span>}
                            {log.object_id && (
                                <Link to={`/books/${log.object_id}`} className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 ml-auto transition-colors">
                                    Kitob sahifasiga o'tish <FaChevronRight className="text-[10px]" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function UserLogsPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [logs, setLogs] = useState([]);

    const [usersLoading, setUsersLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(false);

    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [logsPage, setLogsPage] = useState(1);
    const [logsTotalPages, setLogsTotalPages] = useState(1);

    const [expandedLogId, setExpandedLogId] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Load users
    useEffect(() => {
        const loadUsers = async () => {
            setUsersLoading(true);
            try {
                const response = await fetchUsersList(roleFilter || null, userPage, debouncedSearch || null);
                const data = response?.data || response;
                if (data && data.results) {
                    setUsers(data.results);
                    setUserTotalPages(Math.ceil((data.count || 0) / 10) || 1);
                } else if (Array.isArray(data)) {
                    setUsers(data);
                    setUserTotalPages(1);
                } else {
                    setUsers([]);
                    setUserTotalPages(1);
                }
            } catch (err) {
                console.error("Foydalanuvchilarni yuklashda xatolik:", err);
                setUsers([]);
                setUserTotalPages(1);
            } finally {
                setUsersLoading(false);
            }
        };
        loadUsers();
    }, [userPage, roleFilter, debouncedSearch]);

    // Load logs when user or logsPage changes
    useEffect(() => {
        if (!selectedUser) return;

        const loadLogs = async () => {
            setLogsLoading(true);
            try {
                const response = await fetchUserActionHistory(selectedUser.id, logsPage);
                const data = response?.data || response;
                if (Array.isArray(data)) {
                    setLogs(data);
                    setLogsTotalPages(1);
                } else if (data && data.results) {
                    setLogs(data.results);
                    setLogsTotalPages(Math.ceil((data.count || 0) / 10) || 1);
                } else {
                    setLogs([]);
                }
            } catch (err) {
                console.error("Loglarni yuklashda xatolik:", err);
            } finally {
                setLogsLoading(false);
            }
        };
        loadLogs();
    }, [selectedUser, logsPage]);

    const handleUserSelect = (user) => {
        if (selectedUser?.id !== user.id) {
            setSelectedUser(user);
            setLogsPage(1);
            setLogs([]);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] py-8 font-sans transition-colors duration-300">
            <div className="custom-container mx-auto px-4 md:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <FaHistory className="text-blue-600 dark:text-blue-400" /> Foydalanuvchilar harakatlari
                </h1>

                <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                    {/* Users List Sidebar */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-[calc(100vh-180px)] transition-colors duration-300">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] space-y-3">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Foydalanuvchilar ro'yxati</h2>
                            
                            {/* Qidiruv */}
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                                    <FaSearch className="w-3.5 h-3.5" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Qidirish..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setUserPage(1);
                                    }}
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                                />
                            </div>

                            {/* Rol filteri */}
                            <div>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setUserPage(1);
                                    }}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                                >
                                    <option value="">Barcha rollar</option>
                                    <option value="student">Talaba (student)</option>
                                    <option value="teacher">O'qituvchi (teacher)</option>
                                    <option value="librarian">Kutubxonachi (librarian)</option>
                                    <option value="admin">Admin (admin)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {usersLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {users.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => handleUserSelect(user)}
                                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border border-transparent'}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                                                {user.img ? <img src={user.img} className="w-full h-full rounded-full object-cover" alt="" /> : <FaUser />}
                                            </div>
                                            <div className="overflow-hidden flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">{user.first_name || user.username || "Noma'lum"}</p>
                                                    {user.role && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                                                            user.role === 'admin' ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' :
                                                            user.role === 'librarian' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' :
                                                            user.role === 'teacher' ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' :
                                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}>
                                                            {user.role === 'admin' ? 'Admin' :
                                                             user.role === 'librarian' ? 'Kutubxonachi' :
                                                             user.role === 'teacher' ? "O'qituvchi" : 'Talaba'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || user.username}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {users.length === 0 && !usersLoading && (
                                        <p className="text-center text-gray-500 p-4">Foydalanuvchilar topilmadi</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination for Users */}
                        {userTotalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#252525]">
                                <button
                                    onClick={() => setUserPage(p => Math.max(1, p - 1))}
                                    disabled={userPage === 1}
                                    className="p-2 rounded-lg bg-white dark:bg-[#333] shadow-sm disabled:opacity-50 transition-opacity cursor-pointer"
                                >
                                    <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Sahifa {userPage} / {userTotalPages}
                                </span>
                                <button
                                    onClick={() => setUserPage(p => Math.min(userTotalPages, p + 1))}
                                    disabled={userPage === userTotalPages}
                                    className="p-2 rounded-lg bg-white dark:bg-[#333] shadow-sm disabled:opacity-50 transition-opacity cursor-pointer"
                                >
                                    <FaChevronRight className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logs View */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex flex-col h-[calc(100vh-180px)] transition-colors duration-300 overflow-hidden">
                        {selectedUser ? (
                            <>
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                                            {selectedUser.img ? <img src={selectedUser.img} className="w-full h-full rounded-full object-cover" alt="" /> : <FaUser className="text-xl" />}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser.first_name || selectedUser.username} harakatlari</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    {logsLoading ? (
                                        <div className="flex justify-center p-12">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : logs.length > 0 ? (
                                        <div className="space-y-2 ml-2">
                                            {logs.map((log) => (
                                                <LogItem 
                                                    key={log.id} 
                                                    log={log} 
                                                    isExpanded={expandedLogId === log.id}
                                                    onToggle={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                                            <FaHistory className="text-5xl text-gray-300 dark:text-gray-700 mb-4" />
                                            <p className="text-lg font-medium">Bu foydalanuvchida hali harakatlar yo'q</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination for Logs */}
                                {logsTotalPages > 1 && (
                                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4 bg-gray-50 dark:bg-[#252525]">
                                        <button
                                            onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                                            disabled={logsPage === 1}
                                            className="px-4 py-2 rounded-xl bg-white dark:bg-[#333] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#444] disabled:opacity-50 text-sm font-medium transition-colors text-gray-800 dark:text-gray-200 cursor-pointer"
                                        >
                                            Oldingi
                                        </button>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {logsPage} / {logsTotalPages}
                                        </span>
                                        <button
                                            onClick={() => setLogsPage(p => Math.min(logsTotalPages, p + 1))}
                                            disabled={logsPage === logsTotalPages}
                                            className="px-4 py-2 rounded-xl bg-white dark:bg-[#333] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#444] disabled:opacity-50 text-sm font-medium transition-colors text-gray-800 dark:text-gray-200 cursor-pointer"
                                        >
                                            Keyingi
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-[#333] rounded-full flex items-center justify-center mb-6">
                                    <FaUser className="text-4xl text-gray-300 dark:text-gray-600" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Foydalanuvchini tanlang</h3>
                                <p className="max-w-xs mx-auto text-sm">Tarixni ko'rish uchun chap tomondagi ro'yxatdan biror foydalanuvchini tanlang</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
