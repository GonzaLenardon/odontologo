import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'odontologo_usuario';

export const initialUserState = {
  nombre: '',
  apellido: '',
  rol: 'Administrador',
};

export const UserContext = createContext({
  ...initialUserState,
  updateUser: () => {},
  logout: () => {},
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...initialUserState, ...JSON.parse(raw) } : initialUserState;
    } catch {
      return initialUserState;
    }
  });

  const updateUser = (newUser) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUser };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // sin persistencia disponible -> seguir solo en memoria
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(initialUserState);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('paciente');
    } catch {
      // ignorar
    }
  };

  const value = useMemo(
    () => ({ ...user, updateUser, logout }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
