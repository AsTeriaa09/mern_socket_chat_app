import React, { useState } from "react";
import { useChatGlobalContext } from "../context/ChatContext";
import { useGlobalContext } from "../context/Context";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";


const renameUri = import.meta.env.VITE_RENAME_URL;
const groupremoveUri = import.meta.env.VITE_REMOVE_URL;
const groupAddUri = import.meta.env.VITE_GROUPADD_URL;

const UpdateGroupModal = ({ modalRef, fetchMessages }) => {
  const [groupName, setGroupName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);
  const {
    search,
    setSearch,
    searchResult,
    setSearchResult,
    loading,
    setLoading,
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
  } = useChatGlobalContext();
  const { token } = useGlobalContext();

  const handleRename = async (e) => {
    e.preventDefault();
    if (!groupName) {
      return;
    }
    try {
      // setRenameLoading(true);
      const response = await axios.put(
        renameUri,
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        toast.success("Group name updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setGroupName("");
      }
    } catch (error) {
      console.error("rename user error", error);
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

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove users!", {
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
      const response = await axios.put(
        groupremoveUri,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        user1._id === user._id
          ? setSelectedChat()
          : setSelectedChat(response.data);
        // setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        fetchMessages();

        toast.success("Removed successfully!", {
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
    } catch (error) {
      console.error("user remove error", error);
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
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auth/user?search=${search}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        //console.log("searched users", response.data);
        setSearchResult(response.data);
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

  const handleAddUser = async (user1) => {
    //console.log("User1:", user1);

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already exists in the group", {
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
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone", {
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

    try {
      setLoading(true);
      const response = await axios.put(
        groupAddUri,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        toast.success("User added successfully", {
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
    } catch (error) {
      console.error("user add error", error);
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
        className="modal fade"
        ref={modalRef}
        id="updateGroupModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ borderBottom: "none" }}>
              <h3 className="modal-title text-center w-100">
                {selectedChat.chatName.toUpperCase()}
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* Selected Users */}
              <div className="d-flex row ">
                {/* selected users */}
                {selectedChat.users.map((cur) => {
                  const { _id, name } = cur;
                  return (
                    <div
                      key={_id}
                      className="d-flex align-items-center my-2 py-1 col-lg-3 col-3 ms-2"
                      style={{
                        border: "1px solid skyblue",
                        width: "fit-Content",
                        borderRadius: "25px",
                        backgroundColor: "skyblue",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>{name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(cur)}
                        // className="text-danger"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* Rename Group Input */}
              <form>
                <div className="d-flex mb-3 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rename group"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <button
                    className="btn ms-2"
                    onClick={handleRename}
                    style={{ backgroundColor: "#02ccfe", color: "#fff" }}
                  >
                    Update
                  </button>
                </div>

                {/* Search Users to Add */}
                <div className="mb-3">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search users to add"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </form>

              {/* Search Results */}
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ul>
                  {searchResult.slice(0, 6).map((user) => {
                    const { _id, name, picture } = user;
                    return (
                      <li
                        key={_id}
                        onClick={() => handleAddUser(user)}
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
              )}

              {/* <button type="submit" class="btn btn-danger" >
                            Leave Group
                        </button> */}
              <div className="modal-footer" style={{ borderTop: "none" }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={() => handleRemove(user)}
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateGroupModal;
