import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import useRole from "../../hooks/useRole";

const DesktopNav = ({ categories = [], subcategories = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();
  const { role, checkUserLevel } = useRole();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { key: "home", label: "Bosh sahifa", path: "/" },
    { key: "books", label: "Kutubxona", path: "/books" },
    { key: "top", label: "Top kitoblar", path: "/top-books" },
    { key: "feedback", label: "Fikr-mulohaza", path: "/feedback" },
  ];

  const adminLabels = {
    teacher: { label: "Kitob qo'shish", path: "/createBook" },
    librarian: { label: "Boshqaruv paneli", path: "/bookControl" },
    admin: { label: "Boshqaruv paneli", path: "/bookControl" },
  };

  const adminAction = adminLabels[role];

  return (
    <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-[14.5px] font-interface">
      {navItems.slice(0, 2).map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.key}
            to={item.path}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] transition font-semibold whitespace-nowrap ${
              active
                ? "bg-[#eef1f7] dark:bg-[#1a2540] text-[var(--navy-primary)] dark:text-white font-bold"
                : "text-[var(--text-muted)] hover:bg-[#f4f3ef] dark:hover:bg-[#1a2540] hover:text-[var(--navy-primary)] dark:hover:text-white"
            }`}
          >
            {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--crimson-primary)]" />}
            {item.label}
          </Link>
        );
      })}

      {/* Bo'limlar Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => {
          setIsDropdownOpen(false);
          setActiveCategory(null);
        }}
      >
        <button
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] font-semibold transition cursor-pointer text-[var(--text-muted)] hover:bg-[#f4f3ef] dark:hover:bg-[#1a2540] hover:text-[var(--navy-primary)] dark:hover:text-white`}
        >
          Bo'limlar
          <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-60 bg-[var(--bg-card)] shadow-xl rounded-xl py-2 border border-[var(--border-main)] flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {categories.map((cat) => {
              const catSubcategories = subcategories.filter((sub) => sub.category === cat.id);
              const hasSub = catSubcategories.length > 0;
              return (
                <div key={cat.id} className="relative group" onMouseEnter={() => setActiveCategory(cat.id)}>
                  <div
                    className="flex justify-between items-center px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--navy-light)] hover:text-[var(--navy-primary)] transition cursor-pointer font-medium"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setActiveCategory(null);
                      navigate("/books", { state: { category: cat.id } });
                    }}
                  >
                    <span>{cat?.name}</span>
                    {hasSub && <BiChevronRight className="text-gray-400" />}
                  </div>

                  {hasSub && activeCategory === cat.id && (
                    <div className="absolute left-full top-0 w-52 bg-[var(--bg-card)] shadow-xl rounded-xl py-2 border border-[var(--border-main)] flex flex-col z-50">
                      {catSubcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="px-4 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--navy-light)] hover:text-[var(--navy-primary)] transition cursor-pointer font-medium"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveCategory(null);
                            navigate("/books", { state: { category: cat.id, subcategory: sub.id } });
                          }}
                        >
                          {sub?.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {navItems.slice(2).map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.key}
            to={item.path}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] transition font-semibold whitespace-nowrap ${
              active
                ? "bg-[#eef1f7] dark:bg-[#1a2540] text-[var(--navy-primary)] dark:text-white font-bold"
                : "text-[var(--text-muted)] hover:bg-[#f4f3ef] dark:hover:bg-[#1a2540] hover:text-[var(--navy-primary)] dark:hover:text-white"
            }`}
          >
            {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--crimson-primary)]" />}
            {item.label}
          </Link>
        );
      })}

      {adminAction && (
        <Link
          to={adminAction.path}
          className="ml-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--crimson-light)] border border-[var(--crimson-border)] text-[var(--crimson-primary)] font-bold text-xs hover:opacity-90 transition whitespace-nowrap shadow-xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          {adminAction.label}
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;