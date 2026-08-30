import { createBrowserRouter, Navigate, useRouteError } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import BookDetailPage from "../pages/BookDetailPage";
import UserPage from "../pages/UserPage";
import { AllBooks, FeedbackPage, UserLogsPage } from "../pages";
import TopBooks from "../pages/TopBooks";
import LoginPage from "../pages/Auth/LoginPage";
import BookCreatePage from "../pages/BookCreatePage";
import BookEditPage from "../pages/BookEditPage";
import BookControlPage from "../pages/BookControlPage";
import ProtectedRoute from "../components/ProtectedRoute";

function ErrorBoundary() {
  const error = useRouteError();
  console.error("Router Error:", error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-interface gap-4 p-6 text-center">
      <h1 className="font-editorial text-3xl md:text-4xl font-normal text-[var(--crimson-primary)]">
        Xatolik yuz berdi
      </h1>
      <p className="text-xs md:text-sm text-[var(--text-subtle)] max-w-lg font-mono bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-main)] break-all">
        {error?.message || error?.statusText || String(error || "Noma'lum xatolik")}
      </p>
      {error?.stack && (
        <pre className="text-[11px] text-left bg-[var(--crimson-light)] text-[var(--crimson-primary)] p-4 rounded-xl max-w-2xl overflow-auto max-h-60 font-mono">
          {error.stack}
        </pre>
      )}
      <a
        href="/"
        className="px-5 py-2.5 rounded-xl bg-[var(--navy-primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition mt-2"
      >
        Bosh sahifaga qaytish
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <ProtectedRoute requiredRole="guest" strict />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute requiredRole="guest" />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "books",
            element: <AllBooks />,
          },
          {
            path: "top-books",
            element: <TopBooks />,
          },
          {
            path: "feedback",
            element: <FeedbackPage />,
          },
          {
            path: "books/:id",
            element: <BookDetailPage />,
          },
          {
            path: "profile",
            element: <UserPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute requiredRole="teacher" />,
        children: [
          {
            path: "createBook",
            element: <BookCreatePage />,
          },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="librarian" />,
        children: [
          {
            path: "bookControl",
            element: <BookControlPage />,
          },
          {
            path: "books/:id/edit",
            element: <BookEditPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            path: "user-logs",
            element: <UserLogsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);