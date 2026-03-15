import { createContext } from "react";

export const RoleContext = createContext(null);

const index = ({ children }) => {
  const ROLES = {
    GUEST: 1,
    STUDENT: 2,
    TEACHER: 3,
    LIBRARIAN: 4,
    ADMIN: 5,
  };

  return (
    <RoleContext.Provider value={ROLES}>
      {children}
    </RoleContext.Provider>
  )
}

export default index