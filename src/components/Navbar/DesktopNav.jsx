import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import useRole from "../../hooks/useRole";

const StatChip = ({ label, color, borderColor }) => (
  <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 border ${borderColor} dark:border-opacity-30 px-4 py-2 rounded-xl text-xs font-bold ${color} dark:text-opacity-90 shadow-sm transition-colors duration-300`}>
    {label}
  </div>
);

const DesktopNav = ({ categories, subcategories = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const displayCategories = categories.slice(0);
  const { checkUserLevel } = useRole();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-6">
      <Link
        to={"/"}
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
      >
        Bosh sahifa
      </Link>
      <Link
        to={"/books"}
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
      >
        Kutubxona
      </Link>
      <div
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => {
          setIsDropdownOpen(false);
          setActiveCategory(null);
        }}
      >
        <button className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition py-2">
          Bo'limlar{" "}
          <BiChevronDown
            className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 border border-gray-100 dark:border-gray-700 flex flex-col z-50">
            {displayCategories.map((cat) => {
              const catSubcategories = subcategories.filter(
                (sub) => sub.category === cat.id,
              );
              const hasSub = catSubcategories.length > 0;
              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(cat.id)}
                >
                  <div
                    className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setActiveCategory(null);
                      navigate("/books", { state: { category: cat.id } });
                    }}
                  >
                    {cat?.name}
                    {hasSub && <BiChevronRight />}
                  </div>

                  {hasSub && activeCategory === cat.id && (
                    <div className="absolute left-full top-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 border border-gray-100 dark:border-gray-700 flex flex-col z-50">
                      {catSubcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition"
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

      <Link
        to={"/top-books"}
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
      >
        Top Kitoblar
      </Link>

      <Link
        to={"/feedback"}
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
      >
        Fikr-mulohaza
      </Link>

      {checkUserLevel("teacher") && (
        <Link
          to={"/createbook"}
          className=""
        >
          <StatChip label={"Kitob qo'shish"} color={"text-green-600"} borderColor={"border-green-200"} />
        </Link>
      )}

      {checkUserLevel("librarian") && (
        <Link
          to={"/bookControl"}
          className=""
        >
          <StatChip label={"Kitoblarni boshqarish"} color={"text-sky-600"} borderColor={"border-sky-200"} />
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
