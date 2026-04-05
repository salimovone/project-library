import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const languages = [
  { code: "uz", name: "O'zb", flag: "/src/assets/uz.png" },
  { code: "en", name: "Eng", flag: "/src/assets/gb.png" },
  { code: "ru", name: "Rus", flag: "/src/assets/ru.png" },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex-1 h-10 rounded px-3 py-2 bg-[#f3f3f3] text-[#003282] text-sm font-medium flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <img src={selectedLanguage?.flag} alt={selectedLanguage?.name} className="w-[18px] h-auto object-contain rounded-[2px]" />
        <span>{selectedLanguage?.name}</span>
        <BiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-100 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang)}
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <img src={lang?.flag} alt={lang?.name} className="w-[18px] h-auto object-contain rounded-[2px]" />
              <span>{lang?.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
