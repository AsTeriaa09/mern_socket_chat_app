import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { useChatGlobalContext } from "../context/ChatContext";
import { Link } from "react-router-dom";
import Profile from "../pages/Profile";
import Drawer from "./Drawer";
import "../styles/chatStyle.css"

const SideDrawer = () => {
  const {
    user,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
    selectedChat,
    setSelectedChat,
  } = useChatGlobalContext();

  const [loadingChat, setLoadingChat] = useState("");

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  const handleNotificationClick = (notif) => {
    setSelectedChat(notif.chat);
    // Remove all notifications for the selected chat
    setNotification(notification.filter((n) => n.chat._id !== notif.chat._id));
  };

  return (
    <>
      <div
        className=" d-flex justify-content-between aligh-items-center bg-light w-100 border-2"
        style={{ padding: "5px 10px 5px 10px" }}
      >
        {/* search bar */}
        <div
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="Search users by name or email"
        >
          {" "}
          <button
            class="search-button btn d-lg-flex justify-content-center align-items-center ps-lg-3 ps-2 pe-2 pe-lg-5 pe-0 py-lg-2 py-1 ms-1 mt-2 me-lg-0 me-5"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
            type="submit"
            style={{ border: "1px solid black" }}
          >
            <IoSearch /> <p className="pt-0 px-2 my-0">Search User</p>
          </button>
        </div>

        {/* middle title */}
        <div className="d-flex align-items-center my-2">
          <h3>ChatterBox</h3>
        </div>
        {/* dropdown */}

        <div className="dropdown me-2 d-flex align-items-center">
          {/* <IoMdNotifications className="me-2" style={{fontSize:"28px"}}/> */}
          <div className="dropdown">
            <button
              className="btn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span style={{ position: "relative", display: "inline-block" }}>
                {notification.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-2px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      color: "white",
                      height: "20px",
                      width: "20px",
                      fontSize: "12px",
                    }}
                  >
                    {notification.length}
                  </span>
                )}
                <IoMdNotifications
                  className="notif-button me-lg-2 me-0"
                  style={{ fontSize: "28px" }}
                />
              </span>
            </button>
            <ul className="dropdown-menu p-2">
              {!notification.length && (
                <li className="dropdown-item">No New Messages</li>
              )}
              {notification.map((notif) => (
                <li
                  key={notif._id}
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleNotificationClick(notif);
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="btn btn-outline-secondary bg-none dropdown-toggle d-flex justify-content-center align-items-center"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span
              className="avatar text-bg-primary"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={user.picture}
                alt={user.name}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "8px",
                }}
              />
            </span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <button
                type="button"
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "inherit",
                  textAlign: "left",
                  padding: "0.5rem 1rem",
                  width: "100%",
                }}
              >
                My Profile
              </button>
            </li>
            <li>
              <Link className="dropdown-item" to="/logout">
                Logout <IoIosLogOut className="text-danger" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Profile />
      <Drawer />
    </>
  );
};

export default SideDrawer;
