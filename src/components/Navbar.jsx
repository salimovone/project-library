import { CgSearch } from "react-icons/cg"; 
import { BiBell, BiChevronDown } from "react-icons/bi"; // ChevronDown icon qo'shildi
import { IoPersonOutline } from "react-icons/io5"; 
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import logo from '../assets/logo.png';
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { fetchCategories } from "../services/additional";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  let isMounted = false;
  useEffect(() => {
    if(isMounted) return;

    fetchCategories().then(data=>setCategoriesData(data))

    return () => {
      isMounted = true;
    }
  }, [])

  // 5 tadan ko'p bo'lsa qisqartiramiz
  const displayCategories = categoriesData.slice(0, 5);
  const hasMoreCategories = categoriesData.length > 5;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="custom-container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to={"/"} className="flex items-center hover:opacity-80 transition">
            <img width={120} src={logo} alt="Kutubxona" className="md:w-37.5 " />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Bo'limlar Dropdown - Desktop */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition py-2"
              >
                Bo'limlar <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-100 flex flex-col z-50">
                  {displayCategories.map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/category/${cat.id}`} 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  
                  {/* Agar 5 tadan ko'p bo'lsa "Barchasi" ni chiqaramiz */}
                  {hasMoreCategories && (
                    <Link 
                      to="/categories" 
                      className="px-4 py-2 mt-1 text-sm font-semibold text-blue-600 border-t border-gray-100 hover:bg-gray-50 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Barchasi...
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link to={"/library"} className="text-gray-700 hover:text-blue-600 font-medium transition">
              Kutubxona
            </Link>
            <Link to={"/audiobooks"} className="text-gray-700 hover:text-blue-600 font-medium transition">
              Audio Kitoblar
            </Link>
          </div>

          {/* Search, Language, Notifications, Profile - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative text-[#003282] bg-[#f3f3f3] rounded-full">
              <input 
                type="search" 
                placeholder="Qidiruv" 
                className="pl-10 pr-4 py-2 rounded-full bg-[#f3f3f3] w-40 focus:outline-none focus:ring-2 focus:ring-blue-600" 
              />
              <span className="absolute left-3 top-2.5 text-lg"><CgSearch /></span>
            </div>
            <select className="rounded px-3 py-2 bg-[#f3f3f3] text-[#003282] focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>O'zb</option>
              <option>Eng</option>
              <option>Rus</option>
            </select>
            <button className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition">
              <BiBell className="text-xl" />
            </button>
            <Link
              to="/profile"
              className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition"
            >
              <IoPersonOutline className="text-xl" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Mobile Menu Button - DOM dagi tartibi to'g'rilandi */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="text-2xl text-[#003282] p-2"
            >
              {isMenuOpen ? <MdClose /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="space-y-3 pt-2">
              
              {/* Bo'limlar - Mobile Accordion */}
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
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                    {hasMoreCategories && (
                      <Link 
                        to="/categories" 
                        className="text-sm font-semibold text-blue-600 py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Barchasi...
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <Link 
                to={"/library"} 
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Kutubxona
              </Link>
              <Link 
                to={"/audiobooks"} 
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Audio Kitoblar
              </Link>
              
              {/* Mobile Search */}
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

              {/* Mobile Language & Actions */}
              <div className="flex items-center gap-2">
                <select className="flex-1 rounded px-2 py-2 bg-[#f3f3f3] text-[#003282] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>O'zb</option>
                  <option>Eng</option>
                  <option>Rus</option>
                </select>
                <button className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition">
                  <BiBell className="text-lg" />
                </button>
                <Link
                  to="/profile"
                  className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IoPersonOutline className="text-lg" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;