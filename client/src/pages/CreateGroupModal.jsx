import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useChatGlobalContext } from "../context/ChatContext";
import { useGlobalContext } from "../context/Context";
import { RxCross2 } from "react-icons/rx";

const groupUri = import.meta.env.VITE_GROUP_URL;


const CreateGroupModal = () => {
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
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
  } = useChatGlobalContext();
  const { token } = useGlobalContext();

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
        console.log("searched users", response.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Fill all the input fields", {
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
      const response = await axios.post(
        groupUri,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setChats([response.data, ...chats]);

        toast.success("Group chat Created!", {
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
        setGroupName("");
        setSelectedUsers([]);
        setSearch("");
        setSearchResult([]);
        const modal = document.getElementById("staticBackdrop");
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        }
      }
    } catch (error) {
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

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("user already added", {
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
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const removeUser = (delUser) => {
    try {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    } catch (error) {
      console.error("remove user error", error);
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
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style={{ borderBottom: "none" }}>
              <h5
                class="modal-title text-center w-100"
                id="staticBackdropLabel"
              >
                Create Group Chat
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={handleSubmit}>
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="groupName"
                    name="groupName"
                    value={groupName || ""}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter Group Name"
                  />
                </div>
                <div class="mb-3">
                  <input
                    type="search"
                    class="form-control"
                    id="exampleInputPassword1"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users to add to the group chat"
                  />
                </div>

                <div className="d-flex row">
                  {/* selected users */}
                  {selectedUsers.map((cur) => {
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
                          onClick={() => removeUser(cur)}
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

                {/* searched users array */}
                {loading ? (
                  <>
                    {" "}
                    <p> Loading... </p>{" "}
                  </>
                ) : (
                  <>
                    {searchResult.slice(0, 6).map((user) => {
                      const { _id, name, picture, email } = user;
                      return (
                        <li
                          key={_id}
                          onClick={() => handleGroup(user)}
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
                  </>
                )}

                <button type="submit" class="btn" style={{backgroundColor:"#02ccfe",color:"#fff"}}>
                
                  Create Group
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGroupModal;
