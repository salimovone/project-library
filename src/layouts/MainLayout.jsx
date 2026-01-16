import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * MainLayout Component
 * Responsibility: Provide responsive layout with Outlet for child routes
 * SOLID: Single Responsibility - only manages layout structure
 * Features: Responsive navbar, footer with Tailwind CSS
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content - Outlet */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
