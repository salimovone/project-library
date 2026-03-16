import { useState } from 'react';
import { Link } from 'react-router';
import { CgSearch } from 'react-icons/cg';
import { BiBell, BiChevronDown } from 'react-icons/bi';
import { IoPersonOutline } from 'react-icons/io5';
import LanguageSwitcher from './LanguageSwitcher';

const MobileNav = ({ categories, closeMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const displayCategories = categories.slice(0, 5);
  const hasMoreCategories = categories.length > 5;

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
      <div className="space-y-3 pt-2">
        <div>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between text-gray-700 font-medium py-2 transition"
          >
            Bo'limlar <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="pl-4 py-2 flex flex-col gap-2 border-l-2 border-gray-100 ml-2 mt-1">
              {displayCategories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.id}`} 
                  className="text-sm text-gray-600 hover:text-blue-600 py-1"
                  onClick={closeMenu}
                >
                  {cat?.name}
                </Link>
              ))}
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
          className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition"
          onClick={closeMenu}
        >
          Kutubxona
        </Link>
        <Link 
          to={"/audiobooks"} 
          className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition"
          onClick={closeMenu}
        >
          Audio Kitoblar
        </Link>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="relative text-[#003282] bg-[#f3f3f3] rounded-full mb-3">
            <input 
              type="search" 
              placeholder="Qidiruv" 
              className="pl-10 pr-4 py-2 rounded-full bg-[#f3f3f3] w-full focus:outline-none focus:ring-2 focus:ring-blue-600" 
            />
            <span className="absolute left-3 top-2.5 text-lg"><CgSearch /></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <LanguageSwitcher />
          </div>
          <button className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition">
            <BiBell className="text-lg" />
          </button>
          <Link
            to="/profile"
            className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition"
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
