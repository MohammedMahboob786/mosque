// UserContext.js - Context for managing user state
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const loginUser = (id) => {
    setUserId(id);
    setIsUserLoggedIn(true);
  };

  const logoutUser = () => {
    setUserId('');
    setIsUserLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{
      userId,
      isUserLoggedIn,
      loginUser,
      logoutUser,
      setUserId
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};