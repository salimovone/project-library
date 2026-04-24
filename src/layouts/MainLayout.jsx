import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
