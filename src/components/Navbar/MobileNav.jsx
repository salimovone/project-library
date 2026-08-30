import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { BiChevronDown, BiGridAlt } from 'react-icons/bi';
import { IoPersonOutline } from 'react-icons/io5';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import useRole from "../../hooks/useRole";
import useAuth from "../../hooks/useAuth";

const MobileNav = ({ categories = [], subcategories = [], closeMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { role, checkUserLevel } = useRole();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Bosh sahifa" },
    { path: "/books", label: "Kutubxona" },
    { path: "/top-books", label: "Top kitoblar" },
    { path: "/feedback", label: "Fikr-mulohaza" },
  ];

  const adminLabels = {
    teacher: "Kitob qo'shish",
    librarian: "Boshqaruv paneli",
    admin: "Boshqaruv paneli",
  };

  const getAdminPath = () => {
    if (role === "teacher") return "/createBook";
    return "/bookControl";
  };

  const getInitials = () => {
    if (!user) return "U";
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || user.name || "";
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getUserName = () => {
    if (!user) return "Kabinet";
    if (user.first_name) {
      return `${user.first_name} ${user.last_name ? user.last_name[0] + "." : ""}`.trim();
    }
    return user.username || user.name || "Kabinet";
  };

  return (
    <div className="lg:hidden bg-[var(--bg-card)] border-b border-[var(--border-main)] px-4 py-5 font-interface shadow-lg animate-in slide-in-from-top duration-200">
      <div className="flex flex-col gap-2">
        {/* Navigation items */}
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                isActive
                  ? "bg-[var(--navy-light)] text-[var(--navy-primary)] dark:text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--crimson-primary)]" />}
              {item.label}
            </Link>
          );
        })}

        {/* Categories Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] transition cursor-pointer"
          >
            <span>Bo'limlar</span>
            <BiChevronDown className={`text-lg transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="pl-3 py-2 flex flex-col gap-1.5 border-l-2 border-[var(--border-main)] ml-4 mt-1">
              {categories.slice(0, 8).map((cat) => {
                const catSubcategories = subcategories.filter((sub) => sub.category === cat.id);
                const isCatActive = activeCategory === cat.id;

                return (
                  <div key={cat.id} className="flex flex-col">
                    <div className="flex justify-between items-center pr-2">
                      <Link
                        to="/books"
                        state={{ category: cat.id }}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--navy-primary)] dark:hover:text-white py-1.5 flex-1 truncate"
                        onClick={closeMenu}
                      >
                        {cat?.name}
                      </Link>
                      {catSubcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory(isCatActive ? null : cat.id)}
                          className="px-1.5 py-0.5 bg-[var(--bg-subtle)] rounded-md text-xs cursor-pointer"
                        >
                          <BiChevronDown className={`transition-transform ${isCatActive ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {isCatActive && catSubcategories.length > 0 && (
                      <div className="pl-3 py-1 flex flex-col gap-1 border-l border-[var(--border-main)] ml-2 mt-1">
                        {catSubcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to="/books"
                            state={{ category: cat.id, subcategory: sub.id }}
                            className="text-[11.5px] font-medium text-[var(--text-subtle)] hover:text-[var(--navy-primary)] dark:hover:text-white py-1 truncate"
                            onClick={closeMenu}
                          >
                            {sub?.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Button if staff */}
        {adminLabels[role] && (
          <Link
            to={getAdminPath()}
            onClick={closeMenu}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--crimson-light)] border border-[var(--crimson-border)] text-[var(--crimson-primary)] text-xs font-extrabold transition shadow-xs mt-1"
          >
            <BiGridAlt className="text-base" /> {adminLabels[role]}
          </Link>
        )}

        {/* Footer controls: Language, Dark mode, Profile */}
        <div className="mt-4 pt-4 border-t border-[var(--border-main)] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-3 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-2.5 mt-1">
              <Link to="/profile" onClick={closeMenu} className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-full bg-[var(--navy-primary)] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {getInitials()}
                </span>
                <span className="text-xs font-bold text-[var(--text-main)] truncate">
                  {getUserName()}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout && logout();
                  closeMenu();
                }}
                className="text-xs font-bold text-[var(--crimson-primary)] hover:underline cursor-pointer"
              >
                Chiqish
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[var(--navy-primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition mt-1"
            >
              <IoPersonOutline className="text-base" /> Kirish
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;