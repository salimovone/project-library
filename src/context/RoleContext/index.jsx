import { createContext, useState } from "react";
import { getMe } from "../../services/userService";

export const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("guest");
  const ROLES = {
    guest: 1,
    student: 2,
    teacher: 3,
    librarian: 4,
    admin: 5,
  };

  const getCurrentUserRole = () => {
    try {
      getMe().then((data) => {
        setRole(data.role);
      });
    } catch (error) {}
  };

  useState(() => {
    getCurrentUserRole();
  }, []);

  const checkUserLevel = (requiredRole) => {
    return ROLES[role] >= ROLES[requiredRole];
  };

  return (
    <RoleContext.Provider value={{ checkUserLevel, role }}>
      {children}
    </RoleContext.Provider>
  );
};
