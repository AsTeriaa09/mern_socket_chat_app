import React, { useEffect, useState } from "react";
import { useChatGlobalContext } from "../context/ChatContext";
import { useGlobalContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosAddCircle } from "react-icons/io";
import CreateGroupModal from "../pages/CreateGroupModal";
import "../styles/chatStyle.css";


const fetchChatsUri = import.meta.env.VITE_FETCHCHATS_URL;
const loggedUserUri = import.meta.env.VITE_LOGGEDUSER_URL;

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    user,
    fetchAgain,
    notification,
    setNotification,
  } = useChatGlobalContext();
  const { token } = useGlobalContext();

  const FetchChats = async () => {
    try {
      const response = await axios.get(fetchChatsUri, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        //console.log(response.data);
        setChats(response.data);
      }
    } catch (error) {
      console.error("Fetching chats error", error);
      toast.error("An error occured!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        bodyClassName: "toastBody",
      });
    }
  };
  const getSenderName = (chat) => {
    if (!chat || !loggedUser || !Array.isArray(chat.users)) {
      return "Unknown User";
    }

    // Find the user that is not the logged user
    const otherUser = chat.users.find((user) => user._id !== loggedUser._id);
    return otherUser ? otherUser.name : "Unknown User";
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    // Remove all notifications for the selected chat
    setNotification(notification.filter((n) => n.chat._id !== chat._id));
    //setIsChatBoxExpanded(true);
  };

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get(
          loggedUserUri,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setLoggedUser(response.data);
        } else {
          console.error("Failed to fetch logged user");
        }
      } catch (error) {
        console.error("Error fetching logged user", error);
      }
    };

    if (token) {
      fetchLoggedUser();
      FetchChats();
    }
  }, [fetchAgain]);

  return (
    <>
      {/* my-chats d-flex flex-column align-items-center p-3 bg-white ms-2 my-2 */}
      <div
        className={`d-${
          selectedChat ? "none" : "flex"
        } d-md-flex flex-column align-items-center p-3 bg-white ms-2 my-2 me-lg-0 me-2 my-chat-width`}
        style={{
          // width: "31%",
          borderRadius: "0.5rem",
          border: "1px solid #dee2e6",
          height: "88%",
        }}
      >
        <div className="w-100 d-flex justify-content-between align-items-center px-3 pb-3">
          <h3 className="mb-0" style={{ fontFamily: "Work sans" }}>
            My Chats
          </h3>

          <button
            type="button"
            className="btn btn-secondary btn-sm d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <IoIosAddCircle className="me-2" />
            New Group Chat
          </button>
        </div>

        <div
          className="flex-column p-3 bg-light w-100 h-100"
          style={{
            borderRadius: "0.5rem",
            overflowY: "hidden",
            display: "flex",
          }}
        >
          {chats ? (
            <div style={{ overflowY: "scroll", flexGrow: 1 }}>
              {chats.map((chat) => (
                <div
                  onClick={() => handleChatClick(chat)}
                  className={`d-flex flex-column px-3 py-2 mb-2 ${
                    selectedChat === chat ? "bg-info text-white" : "bg-light"
                  }`}
                  style={{
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    border: "1px solid #dee2e6",
                    width: "100%",
                    //transition: "background-color 0.3s ease",
                    backgroundColor: "white",
                    // backgroundColor:
                    //   selectedChat === chat ? "#87CEEB" : "#f8f9fa",
                    // color: selectedChat === chat ? "#fff" : "#000",
                  }}
                  key={chat._id}
                  onMouseEnter={(e) => {
                    if (selectedChat !== chat) {
                      e.currentTarget.style.backgroundColor = "#87CEEB";
                      // e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChat !== chat) {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#000";
                    }
                  }}
                >
                  <span className="fw-bold" style={{ width: "100%" }}>
                    {!chat.isGroupChat ? getSenderName(chat) : chat.chatName}
                  </span>
                  {chat.latestMessage && (
                    <small style={{ width: "100%" }}>
                      <b>{chat.latestMessage.sender.name}:</b>{" "}
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </small>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <CreateGroupModal />
    </>
  );
};

export default MyChats;
