import React from "react";

const ChatProfileModal = ({ selectedUser, modalRef }) => {
  return (
    <div>
      {selectedUser && (
        <div
          className="modal fade"
          id="profileModal" // Ensure this ID is unique
          tabIndex="-1"
          aria-labelledby="profileModalLabel"
          aria-hidden="true"
          ref={modalRef}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: "none" }}>
                <h5
                  className="modal-title text-center w-100"
                  id="profileModalLabel"
                >
                  <img
                    src={selectedUser?.picture}
                    alt={selectedUser?.name}
                    style={{
                      width: "300px",
                      height: "300px",
                      borderRadius: "50%",
                      objectFit: "cover",
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
                <h3>{selectedUser?.name}</h3>
                <p>{selectedUser?.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatProfileModal;
