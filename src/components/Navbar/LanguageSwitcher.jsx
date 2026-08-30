import { useState } from "react";

const languages = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

const LanguageSwitcher = () => {
  const [selectedLang, setSelectedLang] = useState("uz");

  return (
    <div className="flex items-center h-10 p-0.5 gap-0.5 border border-[var(--border-main)] dark:border-[var(--border-strong)] rounded-full bg-[var(--bg-subtle)] font-interface">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setSelectedLang(lang.code)}
          className={`px-2.5 h-8 rounded-full text-xs font-extrabold transition cursor-pointer ${
            selectedLang === lang.code
              ? "bg-[var(--navy-primary)] text-white shadow-xs"
              : "text-[var(--text-dim)] hover:text-[var(--navy-primary)] dark:hover:text-white"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;