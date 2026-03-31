import { useState } from 'react';
import { Link } from 'react-router';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';

const DesktopNav = ({ categories, subcategories = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const displayCategories = categories.slice(0, 5);
  const hasMoreCategories = categories.length > 5;

  return (
    <div className="hidden md:flex items-center gap-6">
      <div 
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => {
          setIsDropdownOpen(false);
          setActiveCategory(null);
        }}
      >
        <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition py-2">
          Bo'limlar <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg py-2 border border-gray-100 flex flex-col z-50">
            {displayCategories.map(cat => {
              const catSubcategories = subcategories.filter(sub => sub.category === cat.id);
              const hasSub = catSubcategories.length > 0;
              return (
                <div 
                  key={cat.id} 
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(cat.id)}
                >
                  <Link 
                    to={`/category/${cat.id}`} 
                    className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setActiveCategory(null);
                    }}
                  >
                    {cat?.name}
                    {hasSub && <BiChevronRight />}
                  </Link>
                  
                  {hasSub && activeCategory === cat.id && (
                    <div className="absolute left-full top-0 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-100 flex flex-col z-50">
                      {catSubcategories.map(sub => (
                        <Link 
                          key={sub.id} 
                          to={`/category/${cat.id}?subcategory=${sub.id}`} 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveCategory(null);
                          }}
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
                className="px-4 py-2 mt-1 text-sm font-semibold text-blue-600 border-t border-gray-100 hover:bg-gray-50 transition"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setActiveCategory(null);
                }}
              >
                Barchasi...
              </Link>
            )}
          </div>
        )}
      </div>

      <Link to={"/books"} className="text-gray-700 hover:text-blue-600 font-medium transition">
        Kutubxona
      </Link>
      <Link to={"/audiobooks"} className="text-gray-700 hover:text-blue-600 font-medium transition">
        Audio Kitoblar
      </Link>
    </div>
  );
};

export default DesktopNav;
