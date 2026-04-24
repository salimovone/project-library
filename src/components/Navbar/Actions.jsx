import { BiBell } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router";
import LanguageSwitcher from "./LanguageSwitcher";
import Search from "./Search";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../ThemeToggle";

const Actions = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="hidden md:flex items-center gap-3">
      <Search />
      <LanguageSwitcher />
      <ThemeToggle />
      <button className="text-[#003282] dark:text-blue-300 rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition h-10">
        <BiBell className="text-xl" />
      </button>

      {isAuthenticated ?
        (<Link
          to="/profile"
          className="text-[#003282] dark:text-blue-300 rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition h-10"
        >
          <IoPersonOutline className="text-xl" />
          <span>Profile</span>
        </Link>) : (
          <Link
            to="/login"
            className="text-[#003282] dark:text-blue-300 rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition h-10"
          >
            Login
          </Link>
        )
      }
    </div>
  );
};

export default Actions;
