import { CgSearch } from "react-icons/cg"; 
import { BiBell } from "react-icons/bi"; 
import { IoPersonOutline } from "react-icons/io5"; 
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import logo from '../assets/logo.png';
import { Link } from "react-router";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <Link to={"/"} className="text-gray-700 hover:text-blue-600 font-medium transition">
              Bo'limlar
            </Link>
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
            <button className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition">
              <IoPersonOutline className="text-xl" /> 
              <span>Profile</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-2xl text-[#003282] p-2"
          >
            {isMenuOpen ? <MdClose /> : <GiHamburgerMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="space-y-3">
              <Link 
                to={"/"} 
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Bo'limlar
              </Link>
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
                <button className="text-[#003282] rounded px-3 py-2 flex items-center gap-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] transition">
                  <IoPersonOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;