import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isChatOpen, setIsChatOpen] = useState(false); // Controls singleChat view
  const [isDrawerFullWidth, setIsDrawerFullWidth] = useState(false); // Controls the drawer width

  const storeTokenInLocal = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  const LogOutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  return (
    <AppContext.Provider
      value={{
        token,
        storeTokenInLocal,
        isLoggedIn,
        LogOutUser,
        isChatOpen,
        setIsChatOpen,
        isDrawerFullWidth,
        setIsDrawerFullWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
