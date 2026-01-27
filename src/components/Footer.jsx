import logo from "../assets/logo.png";

/**
 * Footer Component
 * Responsibility: Display footer
 */
export default function Footer() {
  return (
    <footer className="bg-white py-10">
      <div className="custom-container flex flex-col items-center gap-6">
        <img src={logo} alt="Alfraganus Library" className="h-10 w-auto" />
        <p className="text-xs text-gray-400">Copyright © 2025 ALFRAGANUS LIBRARY</p>
      </div>
    </footer>
  );
}
