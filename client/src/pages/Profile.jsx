import React from "react";
import { useChatGlobalContext } from "../context/ChatContext";

const Profile = ({ }) => {
  const { user } = useChatGlobalContext();

  //console.log("User data in Profile:", user);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header " style={{ borderBottom: "none" }}>
            <h5
              className="modal-title text-center w-100"
              id="exampleModalLabel"
            >
            
              <img
                src={user.picture}
                alt={user.name}
                style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "8px",
                }}
              />
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ position: "absolute", top: "10px", right: "10px" }}
            ></button>
          </div>
          <div
            className="modal-body text-center w-100"
            style={{ borderBottom: "none" }}
          >
            <h3>{user.name}</h3>
            <div>
              <p> {user.email} </p>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  
  );
};

export default Profile;
