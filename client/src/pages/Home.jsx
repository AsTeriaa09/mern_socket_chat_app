import React, { useEffect } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { useGlobalContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import "../styles/chatStyle.css"

const Home = () => {
  const navigate = useNavigate();
  const { token } = useGlobalContext();

  useEffect(() => {
    if (token) {
      navigate("/chats");
    }
  }, [token, navigate]);

  return (
    <>
      <div className="container text-center">
        <div className="home-header">
          <h2>Talk-A-Tive</h2>
        </div>
        <div className="home-body mb-5">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                SIGN UP
              </button>
            </li>
            <li class="nav-item mx-0" role="presentation">
              <button
                class="nav-link mx-0"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                LOGIN
              </button>
            </li>
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <SignUp />
            </div>
            <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <Login />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
