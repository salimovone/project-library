import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { fetchCategories, fetchSubcategories } from "../../services/additional";
import { Actions, DesktopNav, Logo, MobileNav } from "./components";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchCategories(), fetchSubcategories()]).then(([catData, subcatData]) => {
      if (isMounted) {
        setCategoriesData(catData || []);
        setSubcategoriesData(subcatData || []);
      }
    }).catch((err) => {
      console.error("Navbar categories error:", err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="bg-[var(--bg-card)] border-b border-[var(--border-main)] sticky top-0 z-50 transition-colors duration-300 font-interface">
      <div className="max-w-[1480px] mx-auto px-4 md:px-10 h-[76px] flex items-center justify-between gap-4">
        <Logo />
        
        <DesktopNav categories={categoriesData} subcategories={subcategoriesData} />
        
        <div className="flex items-center gap-3">
          <Actions />
          
          {/* Hamburger button for mobile/tablet */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden text-2xl text-[var(--navy-primary)] dark:text-white p-2 rounded-xl hover:bg-[var(--bg-subtle)] transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <MdClose /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <MobileNav categories={categoriesData} subcategories={subcategoriesData} closeMenu={closeMenu} />
      )}
    </header>
  );
};

export default Navbar;