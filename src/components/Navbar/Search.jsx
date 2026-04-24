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
    <>
      {/* <div className="hidden md:block lg:hidden relative text-[#003282] bg-[#f3f3f3] rounded">
        <input 
          type="search" 
          placeholder="Qidiruv" 
          className="pl-10 pr-4 py-2 rounded bg-[#f3f3f3] w-40 focus:outline-none focus:ring-2 focus:ring-blue-600" 
        />
        <span className="absolute left-3 top-2.5 text-lg"><CgSearch /></span>
      </div> */}

      {/* Search for Large Screens and up */}
      <div ref={searchContainerRef} className="hidden md:flex relative items-center h-10">
        <div 
          className={`relative flex h-10 items-center justify-end transition-all duration-300 ease-in-out rounded bg-[#f3f3f3] dark:bg-gray-800 ${isSearchOpen ? 'w-48' : 'w-10'}`}
        >
          <input
            ref={inputRef}
            type="search"
            placeholder="Qidiruv"
            className={`h-full pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none text-[#003282] dark:text-blue-300 dark:placeholder:text-gray-400 transition-opacity duration-200 ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
          />
          <button
            onClick={() => setIsSearchOpen(true)}
            className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-[#003282] dark:text-blue-300"
          >
            <CgSearch className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Search;
