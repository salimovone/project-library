import { useState, useMemo, useEffect, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";

export default function SearchableSelect({
  name,
  label,
  value,
  onChange,
  options,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOptionName = useMemo(() => {
    const selectedOption = options.find((option) => option?.id === value);
    return selectedOption ? selectedOption?.name : "Barchasi";
  }, [options, value]);

  return (
    <div className="flex flex-col gap-1.5" ref={selectRef}>
      <label className="text-sm font-medium text-[#143c7b] dark:text-blue-300 transition-colors">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 flex justify-between items-center transition-colors"
        >
          <span className="truncate max-w-[180px] text-left font-semibold">{selectedOptionName}</span>
          <BiChevronDown
            className={`text-gray-500 text-lg transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-colors">
            <div className="p-2">
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-gray-700 dark:text-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              <li
                onClick={() => handleSelect("")}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Barchasi
              </li>
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option?.id)}
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    value === option?.name
                      ? "bg-blue-500 dark:bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {option?.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
