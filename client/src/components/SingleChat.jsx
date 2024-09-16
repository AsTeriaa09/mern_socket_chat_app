import React, { useEffect, useRef, useState } from "react";
import { useChatGlobalContext } from "../context/ChatContext";
import { FaArrowLeft } from "react-icons/fa";
import Profile from "../pages/Profile";
import ChatProfileModal from "../pages/ChatProfileModal";
import UpdateGroupModal from "../pages/UpdateGroupModal";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import { useGlobalContext } from "../context/Context";
import ScrollableChat from "./ScrollableChat";
import { IoMdEye } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import io from "socket.io-client";
import { toast } from "react-toastify";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import "../styles/chatstyle.css";

const sendMsgUri = import.meta.env.VITE_SENDMSG_URL;

const ENDPOINT = "http://localhost:3000";
let socket, selectedChatCompare;

const SingleChat = () => {
  // states to handle messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // from context
  const {
    user,
    selectedChat,
    setSelectedChat,
    loading,
    setLoading,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  } = useChatGlobalContext();
  const { token } = useGlobalContext();
  const [selectedUser, setSelectedUser] = useState(null);
  // socket state
  const [socketConnected, setSocketConnected] = useState(false);
  // for modals
  const modalRef = useRef(null);
  const updateGroupModalRef = useRef(null);
  // Tracks whether the current user is typing a message.
  const [typing, setTyping] = useState(false);
  // Tracks whether another user is typing
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    //console.log("User data being sent to socket:", user);
    socket.emit("setup", user);
    socket.on("connected", () => {
      //console.log("Frontend connected to socket.io");
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, [user]);

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  const handleProfileClick = () => {
    const selectedChatUser = getSenderFull(user, selectedChat.users);
    setSelectedUser(selectedChatUser);
    if (modalRef.current) {
      const modalInstance = new window.bootstrap.Modal(modalRef.current);
      modalInstance.show();
    }
  };

  const handleGroupClick = () => {
    if (updateGroupModalRef.current) {
      const modalInstance = new window.bootstrap.Modal(
        updateGroupModalRef.current
      );
      modalInstance.show();
    }
  };

  // logic to send message
  const SendMessage = async (e) => {
    e.preventDefault();
    if (newMessage) {
      socket.emit("stop the typing", selectedChat._id);
      try {
        const response = await axios.post(
          sendMsgUri,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          //console.log(response.data);
          socket.emit("new message", response.data);
          setNewMessage("");
          setMessages([...messages, response.data]);
        }
      } catch (error) {
        console.error("send message error", error);
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
    }
  };

  // to fetch all messages
  const FetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/messsage/fetchmsg/${selectedChat._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        //console.log(response.data);

        setMessages(response.data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      console.error("fetching message error", error);
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

  const TypingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    FetchMessages();
    // keeping backup of selectedchat inside compare
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  //console.log(notification,"msg notification")

  // not adding [] - because we want it to update constantly
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <div className="pb-3 px-2 w-100 d-flex justify-content-between align-items-center">
            <button
              className="d-lg-none d-flex arrow-button"
              onClick={() => setSelectedChat("")}
            >
              <FaArrowLeft />
            </button>
            {!selectedChat.isGroupChat ? (
              <>
                {/* single one on one chat */}

                <button
                  type="button"
                  className=""
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "inherit",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    width: "100%",
                    right: "0",
                  }}
                  onClick={handleProfileClick}
                >
                  <img
                    src={getSenderFull(user, selectedChat.users)?.picture}
                    alt={getSenderFull(user, selectedChat.users)?.name}
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "12px",
                    }}
                  />
                  {getSenderFull(user, selectedChat.users)?.name}
                </button>
              </>
            ) : (
              <>
                {/* Group chat */}
                <div className="d-flex justify-content-between w-100 align-items-center">
                  <span style={{ fontWeight: "500" }}>
                    {selectedChat.chatName.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "inherit",
                      textAlign: "left",
                      padding: "0.5rem 1rem",
                    }}
                    onClick={handleGroupClick}
                  >
                    <BsThreeDotsVertical style={{ fontSize: "20px" }} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* messeges start here*/}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "16px",
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "0.5rem",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <>
                <p>Loading...</p>
              </>
            ) : (
              <div
                className="d-flex messages"
                style={{
                  flex: 1,
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <form
              className="d-flex align-items-center w-100"
              onSubmit={SendMessage}
            >
              <div className="flex-grow-1 me-2">
                {isTyping ? (
                  <>
                    <Lottie
                      options={defaultOptions}
                      style={{
                        width: "70px",
                        marginBottom: "5px",
                        marginLeft: "0",
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  value={newMessage}
                  onChange={TypingHandler}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <IoIosSend />
              </button>
            </form>
          </div>
          {/* messages end here */}

          <ChatProfileModal selectedUser={selectedUser} modalRef={modalRef} />
          <UpdateGroupModal
            modalRef={updateGroupModalRef}
            fetchMessages={FetchMessages}
          />
        </>
      ) : (
        <>
          <h2 className="d-flex m-auto">Click on a user to start chatting</h2>
        </>
      )}
    </>
  );
};

export default SingleChat;
