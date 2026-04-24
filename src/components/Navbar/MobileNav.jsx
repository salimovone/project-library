import { useState } from 'react';
import { Link } from 'react-router';
import { CgSearch } from 'react-icons/cg';
import { BiBell, BiChevronDown } from 'react-icons/bi';
import { IoPersonOutline } from 'react-icons/io5';
import LanguageSwitcher from './LanguageSwitcher';

const MobileNav = ({ categories, subcategories = [], closeMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const displayCategories = categories.slice(0, 5);
  const hasMoreCategories = categories.length > 5;

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-3 pt-2">
        <div>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between text-gray-700 dark:text-gray-300 font-medium py-2 transition"
          >
            Bo'limlar <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="pl-4 py-2 flex flex-col gap-2 border-l-2 border-gray-100 dark:border-gray-700 ml-2 mt-1">
              {displayCategories.map(cat => {
                const catSubcategories = subcategories.filter(sub => sub.category === cat.id);
                const isCatActive = activeCategory === cat.id;

                return (
                  <div key={cat.id} className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <Link 
                        to="/books"
                        state={{ category: cat.id }}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 flex-1"
                        onClick={closeMenu}
                      >
                        {cat?.name}
                      </Link>
                      {catSubcategories.length > 0 && (
                        <button 
                          onClick={() => setActiveCategory(isCatActive ? null : cat.id)}
                          className="px-2"
                        >
                          <BiChevronDown className={`transition-transform duration-200 ${isCatActive ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    {isCatActive && catSubcategories.length > 0 && (
                      <div className="pl-4 py-1 flex flex-col gap-1 border-l-2 border-gray-50 dark:border-gray-800 ml-2">
                        {catSubcategories.map(sub => (
                          <Link 
                            key={sub.id} 
                            to="/books"
                            state={{ category: cat.id, subcategory: sub.id }}
                            className="text-xs text-gray-500 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 py-1"
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
              {hasMoreCategories && (
                <Link 
                  to="/categories" 
                  className="text-sm font-semibold text-blue-600 py-1"
                  onClick={closeMenu}
                >
                  Barchasi...
                </Link>
              )}
            </div>
          )}
        </div>

        <Link 
          to={"/books"} 
          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition"
          onClick={closeMenu}
        >
          Kutubxona
        </Link>
        <Link 
          to={"/top-books"} 
          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition"
          onClick={closeMenu}
        >
          Top Kitoblar
        </Link>
        <Link 
          to={"/feedback"} 
          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition"
          onClick={closeMenu}
        >
          Fikr-mulohaza
        </Link>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative text-[#003282] dark:text-blue-300 bg-[#f3f3f3] dark:bg-gray-800 rounded-full mb-3">
            <input 
              type="search" 
              placeholder="Qidiruv" 
              className="pl-10 pr-4 py-2 rounded-full bg-[#f3f3f3] dark:bg-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:placeholder:text-gray-400 text-[#003282] dark:text-blue-300" 
            />
            <span className="absolute left-3 top-2.5 text-lg"><CgSearch /></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <LanguageSwitcher />
          </div>
          <button className="text-[#003282] dark:text-blue-300 rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition">
            <BiBell className="text-lg" />
          </button>
          <Link
            to="/profile"
            className="text-[#003282] dark:text-blue-300 rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] dark:bg-gray-800 hover:bg-[#e0e0e0] dark:hover:bg-gray-700 transition"
            onClick={closeMenu}
          >
            <IoPersonOutline className="text-lg" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
