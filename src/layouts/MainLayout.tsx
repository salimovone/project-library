import React from 'react';
import { Outlet } from 'react-router';
// Update to use the correct TSX extension for Navbar import if it was explicitly imported in layout. But leaving extensionless works perfectly here.
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
