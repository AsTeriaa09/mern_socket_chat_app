import React, { useState } from "react";
import { useChatGlobalContext } from "../context/ChatContext";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = useChatGlobalContext();
  //const [isChatBoxExpanded, setIsChatBoxExpanded] = useState(false);
  return (
    <div
      className={`d-${selectedChat ? "flex" : "none"} d-md-flex align-items-center flex-column my-2 me-2 ms-2 chat-box-width `}
      style={{
        padding: "16px",
        backgroundColor: "white",
        // width: "68%",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
        // maxWidth: "68%",
        height: "88%",
      }}
    >
      <SingleChat />
    </div>
  //   <div
  //   className={`d-flex d-md-flex align-items-center flex-column my-2 me-2 ${isChatBoxExpanded ? 'expanded' : ''}`}
  //   style={{
  //     padding: "16px",
  //     backgroundColor: "white",
  //     width: isChatBoxExpanded ? "100%" : "68%",
  //     borderRadius: "0.5rem",
  //     border: "1px solid #ccc",
  //     height: "88%",
  //     transition: "width 0.3s ease"
  //   }}
  // >
  //   <SingleChat setIsChatBoxExpanded={setIsChatBoxExpanded} />
  // </div>
  );
};

export default ChatBox;
