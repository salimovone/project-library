import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import BookDetailPage from "../pages/BookDetailPage";
import UserPage from "../pages/UserPage";
import { AllBooks } from "../pages";
import AudioPage from "../pages/AllBooks/AudioPage";
import LoginPage from "../pages/Auth/LoginPage";
import BookCreatePage from "../pages/BookCreatePage";
import BookEditPage from "../pages/BookEditPage";
import BookControlPage from "../pages/BookControlPage";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: (
      <div className="flex items-center justify-center h-screen text-2xl text-red-600">
        Sahifa topilmadi {":("}
      </div>
    ),
    children: [
      {
        element: <ProtectedRoute requiredRole="guest" />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/books",
            element: <AllBooks />,
          },
          {
            path: "/audiobooks",
            element: <AudioPage />,
          },
          {
            path: "/books/:id",
            element: <BookDetailPage />,
          },
          {
            path: "*",
            element: <HomePage />,
          },
        ],
      },
      // {
      //   element: <ProtectedRoute requiredRole="guest" strict />,
      //   children: [
      //     {
      //       path: '/login',
      //       element: <LoginPage />,
      //     },
      //   ]
      // },
      {
        element: <ProtectedRoute requiredRole="student" />,
        children: [
          {
            path: "/profile",
            element: <UserPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="teacher" />,
        children: [
          {
            path: "/createBook",
            element: <BookCreatePage />,
          },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="librarian" />,
        children: [
          {
            path: "/bookControl",
            element: <BookControlPage />,
          },
          {
            path: "/books/:id/edit",
            element: <BookEditPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute requiredRole="guest" strict />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);