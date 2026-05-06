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
    <div className="hidden lg:flex items-center gap-2 xl:gap-3">
      {/* <Search /> */}
      <LanguageSwitcher />
      <ThemeToggle />
      
      {/* Bell Icon: dumaloq (rounded-full) */}
      {/* <button className="text-[#003282] dark:text-blue-300 rounded-full w-10 h-10 flex items-center justify-center bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition">
        <BiBell className="text-xl" />
      </button> */}

      {isAuthenticated ?
        (<Link
          to="/profile"
          className="text-[#003282] dark:text-blue-300 rounded-full px-4 py-2 flex items-center justify-center gap-2 bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition h-10 font-medium text-sm"
        >
          <IoPersonOutline className="text-xl" />
          <span>Profil</span>
        </Link>) : (
          <Link
            to="/login"
            className="text-[#003282] dark:text-blue-300 rounded-full px-5 py-2 flex items-center justify-center bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition h-10 font-medium text-sm"
          >
            Kirish
          </Link>
        )
      }
    </div>
  );
};

export default Actions;