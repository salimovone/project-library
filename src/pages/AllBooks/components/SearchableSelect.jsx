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
    const selectedOption = options.find((option) => option?.name === value);
    return selectedOption ? selectedOption?.name : "Barchasi";
  }, [options, value]);

  return (
    <div className="flex flex-col gap-1.5" ref={selectRef}>
      <label className="text-sm font-medium text-[#143c7b]">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 flex justify-between items-center"
        >
          <span>{selectedOptionName}</span>
          <BiChevronDown
            className={`text-gray-500 text-lg transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              <li
                onClick={() => handleSelect("")}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Barchasi
              </li>
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option?.name)}
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    value === option?.name
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
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
