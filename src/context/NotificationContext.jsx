import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const NotificationContext = createContext();

const ICONS = {
  success: (
    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
};

const THEME = {
  success: {
    iconBg: "bg-green-100 dark:bg-green-900/40",
    border: "border-green-200 dark:border-green-800",
    shadow: "shadow-green-500/10 dark:shadow-green-500/5",
  },
  error: {
    iconBg: "bg-red-100 dark:bg-red-900/40",
    border: "border-red-200 dark:border-red-800",
    shadow: "shadow-red-500/10 dark:shadow-red-500/5",
  },
  info: {
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    border: "border-blue-200 dark:border-blue-800",
    shadow: "shadow-blue-500/10 dark:shadow-blue-500/5",
  },
};

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const timerRef = useRef(null);

  const showNotification = useCallback((message, type = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ show: true, message, type });
    timerRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const hideNotification = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const theme = THEME[notification.type] || THEME.success;
  const icon = ICONS[notification.type] || ICONS.success;

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Notification Toast */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-500 ease-in-out ${
          notification.show
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 bg-white dark:bg-[#1e1e1e] border ${theme.border} rounded-2xl px-6 py-4 shadow-2xl ${theme.shadow}`}
        >
          <div className={`flex-shrink-0 w-10 h-10 ${theme.iconBg} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {notification.message}
          </span>
          <button
            onClick={hideNotification}
            className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
