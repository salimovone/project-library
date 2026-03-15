import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LibraryPage from '../pages/LibraryPage';
import AudiobooksPage from '../pages/AudiobooksPage';
import BookDetailPage from '../pages/BookDetailPage';
import UserPage from '../pages/UserPage';
import { AllBooks } from '../pages';
import LoginPage from '../pages/Auth/LoginPage';
import BookCreatePage from '../pages/BookCreatePage';
import BookControlPage from '../pages/BookControlPage';

// Router configuration - Single Responsibility: only defines routes
// Uses MainLayout as parent route with Outlet for child pages
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div className="flex items-center justify-center h-screen text-2xl text-red-600">Sahifa topilmadi {":("}</div>,
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
      {
        path: '/books',
        element: <AllBooks />,
      },
      {
        path: '/books/:id',
        element: <BookDetailPage />,
      },
      {
        path: '/profile',
        element: <UserPage />,
      },
      {
        path: "/createBook",
        element: <BookCreatePage />
      },
      {
        path: "/bookControl",
        element: <BookControlPage />
      },
      {
        path: '*',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      }
    ],
  },
]);

export const authRouter = createBrowserRouter([
  {
    path: '/',
    errorElement: <div className="flex items-center justify-center h-screen text-2xl text-red-600">Sahifa topilmadi {":("}</div>,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/*',
        element: <LoginPage />,
      }
    ]
  }
])
