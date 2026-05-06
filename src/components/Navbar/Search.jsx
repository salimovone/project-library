import { useState, useRef, useEffect } from "react";
import { CgSearch } from "react-icons/cg";

const Search = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <div ref={searchContainerRef} className="hidden lg:flex relative items-center h-10">
      <div 
        className={`relative flex h-10 items-center justify-end transition-all duration-300 ease-in-out rounded-full bg-[#f3f3f3] dark:bg-gray-800 ${isSearchOpen ? 'w-56' : 'w-10'}`}
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="Qidiruv"
          className={`h-full pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none text-[#003282] dark:text-blue-300 dark:placeholder:text-gray-400 transition-opacity duration-200 rounded-full ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
        />
        <button
          onClick={() => setIsSearchOpen(true)}
          className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-[#003282] dark:text-blue-300 rounded-full"
        >
          <CgSearch className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Search;