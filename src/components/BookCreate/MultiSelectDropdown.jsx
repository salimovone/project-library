import { useState, useRef, useEffect } from 'react';

export default function MultiSelectDropdown({
  selectedIds,
  items,
  onToggleItem,
  onOpenCreate,
  label,
  placeholder,
  createType,
  colorTheme = "blue" // "blue" | "green"
}) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const chipBg = colorTheme === "blue" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  const chipBtnColor = colorTheme === "blue" ? "text-blue-600 hover:text-blue-900" : "text-green-600 hover:text-green-900";

  return (
    <div className="space-y-1.5" ref={wrapperRef}>
      <label className="text-sm font-bold text-[#143c7b]">{label}</label>
      <div className="flex gap-2 items-start">
        <div className="relative flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 min-h-[50px] flex flex-wrap gap-1.5 items-center focus-within:ring-1 focus-within:ring-blue-500 transition-all">

          {/* Selected chips inside */}
          {selectedIds.map((id) => {
            const item = items.find((a) => a.id === id);
            return item ? (
              <span
                key={id}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full ${chipBg}`}
              >
                {item.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleItem(id);
                  }}
                  className={`focus:outline-none ${chipBtnColor}`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}

          {/* Input field */}
          <input
            type="text"
            placeholder={selectedIds.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-700 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 w-full z-20 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">Topilmadi</div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${selectedIds.includes(item.id) ? "bg-blue-100 font-semibold" : ""
                      }`}
                    onClick={() => {
                      onToggleItem(item.id);
                    }}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${selectedIds.includes(item.id)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300"
                        }`}
                    >
                      {selectedIds.includes(item.id) && "✓"}
                    </span>
                    {item.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenCreate(createType)}
          className="bg-green-600 text-white px-4 rounded-xl text-sm font-bold hover:bg-green-700 transition whitespace-nowrap min-h-[50px] self-start"
        >
          + Yaratish
        </button>
      </div>
    </div>
  );
}
