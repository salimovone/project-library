import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import {
  FiGrid,
  FiBookmark,
  FiAlertCircle,
  FiBookOpen,
  FiPlusCircle,
  FiUsers,
  FiShield,
} from "react-icons/fi";
import logo from "../assets/logo.png";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";

export default function AdminSidebar({ activeKey, isMobileOpen, onCloseMobile }) {
  const { role } = useRole();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const roleLabels = {
    admin: "ADMIN",
    librarian: "KUTUBXONACHI",
    teacher: "O'QITUVCHI",
  };

  const navGroups = [
    {
      title: "Kunlik ish",
      items: [
        { key: "dashboard", label: "Dashboard", path: "/bookControl", icon: FiGrid },
        { key: "reservations", label: "Bandlovlar", path: "/bookControl?tab=reservations", badge: "12", icon: FiBookmark },
        { key: "overdue", label: "Muddati o'tganlar", path: "/bookControl?tab=overdue", badge: "5", icon: FiAlertCircle },
      ],
    },
    {
      title: "Fond",
      items: [
        { key: "books", label: "Kitob fondi", path: "/bookControl?tab=books", icon: FiBookOpen },
        { key: "create", label: "Kitob qo'shish", path: "/createBook", icon: FiPlusCircle },
      ],
    },
    {
      title: "Nazorat",
      items: [
        { key: "users", label: "Foydalanuvchilar", path: "/bookControl?tab=users", icon: FiUsers },
        { key: "logs", label: "Audit log", path: "/user-logs", icon: FiShield },
      ],
    },
  ];

  const allowedKeys =
    role === "teacher"
      ? ["dashboard", "books", "create"]
      : role === "librarian"
      ? ["dashboard", "reservations", "overdue", "books", "create"]
      : ["dashboard", "reservations", "overdue", "books", "create", "users", "logs"];

  const getInitials = () => {
    if (!user) return "SS";
    const name = user.first_name || user.username || user.name || "Sardor Salimov";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getUserName = () => {
    if (!user) return "Sardor Salimov";
    return user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.username || "Sardor Salimov";
  };

  const computedActiveKey =
    activeKey ||
    (location.pathname === "/user-logs"
      ? "logs"
      : location.pathname === "/createBook"
      ? "create"
      : tabParam || "dashboard");

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`bg-[#1b3f7a] text-white flex flex-col p-5 font-interface h-screen select-none transition-transform duration-300 z-50 ${
          isMobileOpen
            ? "fixed top-0 left-0 w-72 shadow-2xl translate-x-0 overflow-y-auto"
            : "hidden lg:flex lg:sticky lg:top-0 lg:w-64 2xl:lg:w-72 shrink-0 overflow-y-auto"
        }`}
      >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 pb-5">
        <Link to="/">
          <img src={logo} alt="Alfraganus University Library" className="h-7.5 w-auto brightness-0 invert opacity-95" />
        </Link>
      </div>

      {/* Status Pill */}
      <div className="flex items-center gap-2.5 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 mb-5">
        <span className="w-2 h-2 rounded-full bg-[#5fd28a]" />
        <span className="text-[11.5px] font-bold text-[#dbe3f1] tracking-wide">Boshqaruv paneli</span>
        <span className="ml-auto text-[10px] font-extrabold tracking-wider text-[#f0b64a] bg-[#f0b64a]/15 rounded px-1.5 py-0.5">
          {roleLabels[role] || "ADMIN"}
        </span>
      </div>

      {/* Nav Menu */}
      <div className="flex flex-col gap-1">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => allowedKeys.includes(item.key));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#5f7093] px-2.5 pt-4 pb-1.5 block">
                {group.title}
              </span>
              {visibleItems.map((item) => {
                const isActive = computedActiveKey === item.key;
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] transition ${
                      isActive
                        ? "bg-white text-[#0f1f42] font-bold shadow-xs"
                        : "text-[#a8b6cf] font-semibold hover:bg-white/7 hover:text-white"
                    }`}
                  >
                    <span
                      className={`w-1 h-4 rounded-xs transition-colors ${
                        isActive ? "bg-[var(--crimson-primary)] -ml-1" : "bg-transparent -ml-1"
                      }`}
                    />
                    {ItemIcon && <ItemIcon className={`text-base shrink-0 ${isActive ? "text-[#16305e]" : "text-[#8fa1c2]"}`} />}
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[var(--crimson-primary)] text-white"
                            : "bg-[#f0b64a]/15 text-[#f0b64a]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex-1 min-h-[24px]" />

      {/* Footer / User Widget */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/14 text-[#dbe3f1] text-xs font-bold hover:bg-white/10 transition"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          Saytga qaytish
        </Link>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/6">
          <span className="w-8.5 h-8.5 rounded-full bg-[#2f5fa8] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
            {getInitials()}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[12.5px] font-bold text-white truncate block">{getUserName()}</span>
            <span className="text-[11px] text-[#8fa1c2] capitalize truncate">{role || "Admin"}</span>
          </div>
          <button
            onClick={() => logout && logout()}
            className="ml-auto text-[#8fa1c2] hover:text-white transition p-1 cursor-pointer"
            title="Chiqish"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
