import { useState } from "react";
import { Link, useNavigate } from "react-router";
import LanguageSwitcher from "./LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../ThemeToggle";

const Actions = () => {
  const { isAuthenticated, user } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate("/books", { state: { search: query } });
    }
  };

  const getInitials = () => {
    if (!user) return "AS";
    const name = user.first_name || user.username || user.name || "Aziza Salimova";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getUserName = () => {
    if (!user) return "Aziza S.";
    return user.first_name ? `${user.first_name} ${user.last_name ? user.last_name[0] + "." : ""}` : user.username || "Aziza S.";
  };

  return (
    <div className="hidden lg:flex items-center gap-2.5 font-interface">
      {/* Quick Search */}
      <form onSubmit={handleSearchSubmit} className="relative hidden xl:flex items-center">
        <label className="flex items-center gap-2 h-10 px-3 border border-[var(--border-main)] dark:border-[var(--border-strong)] rounded-full bg-[var(--bg-subtle)] w-48 focus-within:w-60 focus-within:border-[var(--navy-primary)] transition-all duration-300">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4.2-4.2" />
          </svg>
          <input
            type="text"
            placeholder="Kitob, muallif, ISBN…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[13.5px] text-[var(--text-main)] placeholder-[#8a93a6] outline-none font-medium"
          />
          <span className="ml-auto text-[10.5px] font-bold text-[#a7aebd] border border-[var(--border-main)] rounded px-1 py-0.5 bg-white dark:bg-gray-800">
            ⌘K
          </span>
        </label>
      </form>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Dark Mode Toggle */}
      <ThemeToggle />

      {/* User / Login Button */}
      {isAuthenticated ? (
        <Link
          to="/profile"
          className="flex items-center gap-2.5 h-10 pl-1 pr-3.5 rounded-full bg-[#f4f3ef] dark:bg-[#131c30] border border-[var(--border-main)] dark:border-[var(--border-strong)] hover:border-[var(--navy-primary)] transition"
        >
          <span className="w-8 h-8 rounded-full bg-[var(--navy-primary)] text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
            {getInitials()}
          </span>
          <span className="text-xs font-bold text-[var(--navy-primary)] dark:text-white truncate max-w-[100px]">
            {getUserName()}
          </span>
        </Link>
      ) : (
        <Link
          to="/login"
          className="flex items-center justify-center h-10 px-5 rounded-full bg-[var(--navy-primary)] text-white font-bold text-[13.5px] hover:opacity-90 transition shadow-xs"
        >
          Kirish
        </Link>
      )}
    </div>
  );
};

export default Actions;