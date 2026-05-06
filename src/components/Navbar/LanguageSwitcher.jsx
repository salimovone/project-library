import { useState, useRef, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import uzFlg from "../../assets/uz.png";
import enFlg from "../../assets/gb.png";
import ruFlg from "../../assets/ru.png";

const languages = [
  { code: "uz", name: "O'zbek", flag: uzFlg }, // "O'zb" o'rniga "O'zbek" yoki shunchaki "UZ" yaxshiroq ko'rinishi mumkin
  { code: "en", name: "English", flag: enFlg },
  { code: "ru", name: "Русский", flag: ruFlg },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  // Tashqariga bosilganda yopilishi uchun
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex-1 h-10 rounded-full px-4 py-2 bg-[#f3f3f3] dark:bg-gray-800 text-[#003282] dark:text-blue-300 text-sm font-medium flex items-center gap-2 focus:outline-none transition-colors duration-300 hover:bg-[#e0e0e0] dark:hover:bg-gray-700"
      >
        <img src={selectedLanguage?.flag} alt={selectedLanguage?.name} className="w-5 h-auto object-contain rounded-sm" />
        <BiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-xl py-1 border border-gray-100 dark:border-gray-700 z-50 transition-colors duration-300 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang)}
              className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <img src={lang?.flag} alt={lang?.name} className="w-5 h-auto object-contain rounded-sm" />
              <span>{lang?.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;