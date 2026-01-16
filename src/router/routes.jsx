import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LibraryPage from '../pages/LibraryPage';
import AudiobooksPage from '../pages/AudiobooksPage';

// Router configuration - Single Responsibility: only defines routes
// Uses MainLayout as parent route with Outlet for child pages
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div className="flex items-center justify-center h-screen text-2xl text-red-600">❌ Sahifa topilmadi</div>,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/library',
        element: <LibraryPage />,
      },
      {
        path: '/audiobooks',
        element: <AudiobooksPage />,
      },
    ],
  },
]);
