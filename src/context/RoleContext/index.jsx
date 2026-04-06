import { createContext, useState, useEffect, useRef } from "react";
import { getMe } from "../../services/userService";

export const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const ROLES = {
    guest: 1,
    student: 2,
    teacher: 4,
    librarian: 4,
    admin: 5,
  };

  useEffect(() => {
    if (hasFetched.current) return;

    const getCurrentUserRole = async () => {
      try {
        hasFetched.current = true;
        const data = await getMe();
        if (data && data.role) {
          setRole(data.role);
        }
      } catch (error) {
        setRole("guest");
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUserRole();
  }, []);

  const checkUserLevel = (requiredRole) => {
    return ROLES[role] >= ROLES[requiredRole];
  };

  return (
    <RoleContext.Provider value={{ checkUserLevel, role, isLoading }}>
      {!isLoading ? children : <div className="flex h-screen items-center justify-center">Yuklanmoqda...</div>}
    </RoleContext.Provider>
  );
};