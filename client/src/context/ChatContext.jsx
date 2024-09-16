import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./Context";

const ChatContext = React.createContext();

// const userURI = process.env.REACT_APP_LOGGED_USER_URI;
const userURI = "http://localhost:3000/api/auth/loggeduser";

const ChatProvider = ({ children }) => {
  const { token } = useGlobalContext();

  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([])

  //  to get logged in user info
  const UserAuthentication = async () => {
    try {
      const response = await axios.get(userURI, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        //console.log(response.data);
        setUser(response.data);
      }
    } catch (error) {
      console.log("user error", error);
    }
  };

  useEffect(() => {
    if(token){
      UserAuthentication();
    }
   
  }, [token]);

  return (
    <>
      <ChatContext.Provider
        value={{
          user,
          UserAuthentication,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          search,
          setSearch,
          searchResult,
          setSearchResult,
          loading,
          setLoading,
          fetchAgain, setFetchAgain,
          notification, setNotification
        }}
      >
        {children}
      </ChatContext.Provider>
    </>
  );
};

const useChatGlobalContext = () => {
  return useContext(ChatContext);
};

export { ChatProvider, ChatContext, useChatGlobalContext };
