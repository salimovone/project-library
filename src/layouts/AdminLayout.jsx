import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import AdminSidebar from "../components/AdminSidebar";
import logo from "../assets/logo.png";

export default function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine active key from query param or pathname
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");
  
  let activeKey = "dashboard";
  if (location.pathname === "/createBook") {
    activeKey = "create";
  } else if (location.pathname === "/user-logs") {
    activeKey = "logs";
  } else if (tab) {
    activeKey = tab;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--bg-page)] transition-colors duration-300 font-interface">
      {/* Mobile Topbar for Admin Panel */}
      <div className="lg:hidden bg-[#1b3f7a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer text-xl"
            aria-label="Open sidebar menu"
          >
            <GiHamburgerMenu />
          </button>
          <span className="text-sm font-bold tracking-wide">Boshqaruv paneli</span>
        </div>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-6 w-auto brightness-0 invert opacity-95" />
        </Link>
      </div>

      <AdminSidebar
        activeKey={activeKey}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
