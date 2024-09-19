import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/Context";
import { useChatGlobalContext } from "../context/ChatContext";

const accessChatUri = import.meta.env.VITE_ACCESSCHAT_URL;

const Drawer = () => {
  const { token } = useGlobalContext();
  const {
    search,
    setSearch,
    searchResult,
    setSearchResult,
    loading,
    setLoading,
  } = useChatGlobalContext();

  const { selectedChat, setSelectedChat, chats, setChats } =
    useChatGlobalContext();

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter name or email of an user to search", {
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
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://mern-socket-chat-app.onrender.com/api/auth/user?search=${search}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        //console.log("searched users", response.data);
        setSearchResult(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("handlesearch error", error);
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

  const accessChat = async (userId) => {
    try {
      const response = await axios.post(
        accessChatUri,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        if (!chats.find((c) => c._id === response.data._id)) {
          setChats([...chats, response.data]);
        }
        //console.log(response.data);
        setSelectedChat(response.data);
        setLoading(false);
        const closeButton = document.querySelector(
          '[data-bs-dismiss="offcanvas"]'
        );
        if (closeButton) {
          closeButton.click(); // Trigger the close button click
        }
      }
    } catch (error) {
      console.error("handlesearch error", error);
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

  return (
    <>
      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="offcanvas-header">
          <h3>Search Users</h3>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div className="d-flex">
            <input
              className="me-2 ps-3"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Users"
            />
            <button
              class="btn btn-primary"
              type="submit"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          {loading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            <>
              {searchResult.length > 0 ? (
                <ul>
                  {searchResult.map((user) => {
                    const { _id, name, picture, email } = user;
                    return (
                      <li
                        key={_id}
                        onClick={() => accessChat(_id)}
                        className="d-flex align-items-center my-2"
                      >
                        <img
                          src={picture}
                          alt={name}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        <span>{name}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <>
                  <p className="mt-5 text-center">No users found</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Drawer;
