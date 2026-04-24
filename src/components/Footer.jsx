import logo from "../assets/logo.png";

/**
 * Footer Component
 * Responsibility: Display footer
 */
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1e1e1e] py-10 transition-colors duration-300">
      <div className="custom-container flex flex-col items-center gap-6">
        <img src={logo} alt="Alfraganus Library" className="h-10 w-auto opacity-90 dark:opacity-80 transition-opacity" />
        <p className="text-xs text-gray-400 dark:text-gray-500">Copyright © 2025 ALFRAGANUS LIBRARY</p>
      </div>
    </footer>
  );
}
