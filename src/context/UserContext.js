import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { refreshToken } from '../api/sesion/refreshToken';

// initial values
export const initialUserState = {
  token: '',
  refreshToken: '',
  id_usuario: 0,
  id_rol: 0,
  nombre_rol: '',
  nombre: '',
  apellido: '',
};

export const UserContext = createContext({
  ...initialUserState,
  updateUser: () => {},
  logout: () => {},
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : initialUserState;
  });

  const [refreshing, setRefreshing] = useState(false);

  const updateUser = (newUser) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUser };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = async (exit = false) => {
    if (exit) {
      salir();
      return;
    }

    setRefreshing(true);
    const { refreshCode, accessToken, refreshTok } = await refreshToken();

    console.log('jejejej ....', refreshCode, accessToken, refreshTok);

    if (refreshCode === 200) {
      await new Promise((resolve) => {
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            token: accessToken,
            refreshToken: refreshTok,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          resolve();
          return updatedUser;
        });
      });
    } else {
      setRefreshing(false);
      await new Promise((resolve) => {
        salir();
        resolve();
      });
    }
    return refreshCode;
  };

  const salir = () => {
    setUser(initialUserState);
    localStorage.removeItem('user');
  };

  const [previousContext, setPreviousContext] = useState();

  const contextValue = useMemo(() => {
    if (!refreshing) {
      setPreviousContext({
        ...user,
        updateUser,
        logout,
      });
      return {
        ...user,
        updateUser,
        logout,
      };
    } else {
      setRefreshing(false);
      return previousContext;
    }
  }, [user]);

  useEffect(() => {
    setPreviousContext(contextValue);
  }, [contextValue]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};
