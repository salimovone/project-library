import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { fetchCategories, fetchSubcategories } from "../../services/additional";
import {Actions, DesktopNav, Logo, MobileNav} from "./components";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchCategories(), fetchSubcategories()]).then(([catData, subcatData]) => {
      if (isMounted) {
        setCategoriesData(catData);
        setSubcategoriesData(subcatData);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="custom-container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          <DesktopNav categories={categoriesData} subcategories={subcategoriesData} />
          <Actions />
          
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="text-2xl text-[#003282] p-2"
            >
              {isMenuOpen ? <MdClose /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <MobileNav categories={categoriesData} subcategories={subcategoriesData} closeMenu={closeMenu} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
