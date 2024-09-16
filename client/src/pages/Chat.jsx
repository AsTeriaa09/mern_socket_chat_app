import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/chatStyle.css"

import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useGlobalContext } from "../context/Context";

const Chat = () => {
  const { token } = useGlobalContext();

  return (
    <>
      <div style={{ width: "100%" }}>
        {token && <SideDrawer />}
        {/* justify-content-between */}
        <div className="chat-container d-flex  vh-100 w-100">
        
        {token && <MyChats/>}
      
        
          {token && <ChatBox />}
      
          
          
        </div>
      </div>
    </>
  );
};

export default Chat;
