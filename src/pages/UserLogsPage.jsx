import { useState, useEffect } from "react";
import { fetchUsersList } from "../services/userService";
import { fetchUserActionHistory } from "../services/auditLogs";
import { FaUser, FaHistory, FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, FaSearch } from "react-icons/fa";
import { Link } from "react-router";

const actionTranslations = {
  UPDATE: "yangiladi",
  CREATE: "yaratdi",
  DELETE: "o'chirdi",
};

const LogItem = ({ log, isExpanded, onToggle }) => {
  const actionText = actionTranslations[log.action?.toUpperCase()] || log.action_display || log.action;

  const getBookName = (desc) => {
    if (!desc) return "";
    const match = desc.match(/kitob:\s*(.*)/i);
    return match ? match[1].split("\n")[0].trim() : "";
  };
  const bookName = getBookName(log.description);

  return (
    <div
      className="border-l-2 border-[var(--navy-primary)] pl-4 py-2 relative cursor-pointer hover:bg-[var(--bg-subtle)] transition font-interface"
      onClick={onToggle}
    >
      <div className="absolute w-2.5 h-2.5 bg-[var(--navy-primary)] rounded-full -left-[6px] top-3 border-2 border-[var(--bg-card)]" />
      <div className="flex justify-between items-start gap-4">
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-[var(--text-main)] flex items-center flex-wrap gap-x-1">
            Foydalanuvchi{" "}
            <span className="font-extrabold text-[var(--navy-primary)] dark:text-blue-300 lowercase">{actionText}</span>
            {log.model_name && <span className="text-[var(--text-subtle)] font-normal">({log.model_name})</span>}
            {bookName && <span className="text-[var(--text-main)] font-bold truncate max-w-[200px]">"{bookName}"</span>}
          </p>
          <p className="text-[11px] font-semibold text-[var(--text-subtle)] mt-1 flex items-center gap-1">
            <FaHistory className="text-[9px]" />
            {new Date(log.timestamp).toLocaleString("uz-UZ", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="mt-1 shrink-0 text-gray-400">
          {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-2.5" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
        <div className="overflow-hidden">
          <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-main)] text-xs shadow-xs" onClick={(e) => e.stopPropagation()}>
            {log.description && (
              <div className="mb-2">
                <p className="font-bold text-[var(--text-main)] mb-1">Tavsif:</p>
                <p className="text-[var(--text-muted)] whitespace-pre-wrap">{log.description}</p>
              </div>
            )}
            {log.changes && Object.keys(log.changes).length > 0 && (
              <div className="mt-2.5">
                <p className="font-bold text-[var(--text-main)] mb-1.5">O'zgarishlar:</p>
                <div className="space-y-1.5">
                  {Object.entries(log.changes).map(([key, value]) => (
                    <div key={key} className="bg-[var(--bg-subtle)] p-2 rounded-lg border border-[var(--border-main)]">
                      <span className="font-bold text-[var(--text-main)] block mb-1">{key}:</span>
                      <div className="text-[11px] grid grid-cols-2 gap-2">
                        <div className="bg-[var(--crimson-light)] text-[var(--crimson-primary)] p-1 rounded font-medium break-all">
                          - {value.old === null || value.old === "" ? <span className="italic opacity-50">bo'sh</span> : String(value.old)}
                        </div>
                        <div className="bg-[#eaf7ee] text-[#2d7a46] dark:text-[#5fd28a] p-1 rounded font-medium break-all">
                          + {value.new === null || value.new === "" ? <span className="italic opacity-50">bo'sh</span> : String(value.new)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2.5 text-[10.5px] text-[var(--text-subtle)] flex flex-wrap gap-2 border-t border-[var(--border-main)] pt-2 items-center justify-between font-semibold">
              {log.ip_address && <span>IP: {log.ip_address}</span>}
              {log.object_id && (
                <Link to={`/books/${log.object_id}`} className="text-[var(--navy-primary)] dark:text-blue-300 hover:underline font-bold flex items-center gap-1 ml-auto">
                  Kitob sahifasiga o'tish <FaChevronRight className="text-[9px]" />
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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
    <div className="p-6 md:p-8 font-interface flex flex-col gap-6 text-[var(--text-main)]">
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 shadow-xs flex flex-col gap-1">
        <h1 className="font-editorial text-2.5xl md:text-3xl font-normal text-[var(--text-main)] flex items-center gap-2.5">
          <FaHistory className="text-[var(--navy-primary)] text-xl" /> Audit log va foydalanuvchilar harakati
        </h1>
        <span className="text-xs text-[var(--text-subtle)]">
          Tizim foydalanuvchilarining harakatlar tarixi, tahrirlar va o'chirishlar jurnali
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-220px)] shadow-xs">
          <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-subtle)] flex flex-col gap-3">
            <h2 className="text-sm font-extrabold text-[var(--text-main)] tracking-tight">
              Foydalanuvchilar ro'yxati
            </h2>

            <div className="relative flex items-center h-10 px-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl">
              <FaSearch className="text-gray-400 text-xs shrink-0" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setUserPage(1);
                }}
                className="w-full bg-transparent ml-2 text-xs font-semibold text-[var(--text-main)] placeholder-[#8a93a6] outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setUserPage(1);
              }}
              className="w-full h-10 px-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl text-xs font-semibold text-[var(--text-main)] outline-none cursor-pointer"
            >
              <option value="">Barcha rollar</option>
              <option value="student">Talaba</option>
              <option value="teacher">O'qituvchi</option>
              <option value="librarian">Kutubxonachi</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {usersLoading ? (
              <div className="flex justify-center p-8 text-xs font-bold text-[var(--navy-primary)]">
                Yuklanmoqda...
              </div>
            ) : (
              users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleUserSelect(u)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
                    selectedUser?.id === u.id
                      ? "bg-[var(--navy-light)] border border-[var(--navy-primary)] text-[var(--navy-primary)] font-bold shadow-xs"
                      : "hover:bg-[var(--bg-subtle)] border border-transparent text-[var(--text-main)]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--navy-primary)] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {u.first_name ? u.first_name[0] : "U"}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold truncate">
                      {u.first_name ? `${u.first_name} ${u.last_name || ""}` : u.username}
                    </span>
                    <span className="text-[11px] text-[var(--text-subtle)] capitalize truncate">
                      {u.role || "Talaba"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {userTotalPages > 1 && (
            <div className="p-3 border-t border-[var(--border-main)] bg-[var(--bg-subtle)] flex items-center justify-between text-xs">
              <button
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                disabled={userPage === 1}
                className="p-1.5 rounded-lg border border-[var(--border-main)] disabled:opacity-40 cursor-pointer"
              >
                <FaChevronLeft />
              </button>
              <span className="font-bold text-[var(--text-subtle)]">
                {userPage} / {userTotalPages}
              </span>
              <button
                onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                disabled={userPage === userTotalPages}
                className="p-1.5 rounded-lg border border-[var(--border-main)] disabled:opacity-40 cursor-pointer"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl flex flex-col h-[calc(100vh-220px)] shadow-xs overflow-hidden">
          {selectedUser ? (
            <>
              <div className="p-5 border-b border-[var(--border-main)] bg-[var(--bg-subtle)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--navy-primary)] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {selectedUser.first_name ? selectedUser.first_name[0] : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text-main)]">
                    {selectedUser.first_name} {selectedUser.last_name} harakatlari
                  </span>
                  <span className="text-xs text-[var(--text-subtle)]">
                    Role: {selectedUser.role || "talaba"} · ID: {selectedUser.id}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                {logsLoading ? (
                  <div className="flex justify-center p-12 text-xs font-bold text-[var(--navy-primary)]">
                    Harakatlar tarixi yuklanmoqda...
                  </div>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <LogItem
                      key={log.id}
                      log={log}
                      isExpanded={expandedLogId === log.id}
                      onToggle={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-subtle)] font-medium">
                    Ushbu foydalanuvchida hali harakatlar qayd etilmagan.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-subtle)] font-medium p-8">
              <FaUser className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
              <span className="text-sm font-bold text-[var(--text-main)]">Foydalanuvchini tanlang</span>
              <span className="text-xs text-[var(--text-subtle)] mt-1">
                Tarixni ko'rish uchun chap tomondagi ro'yxatdan biror foydalanuvchini tanlang
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
