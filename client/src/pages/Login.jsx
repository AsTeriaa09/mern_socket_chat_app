import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Context";
import { toast } from "react-toastify";


const loginUri = import.meta.env.VITE_LOGIN_URL;

const Login = () => {
  const LoginInfo = { email: "", password: "" };
  const [login, setLogin] = useState(LoginInfo);
  const { storeTokenInLocal } = useGlobalContext();
  const navigate = useNavigate();


  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(loginUri, login, {
        headers: { "Content-Type": "application/json" },
      });
      // const res_data = await response.json();
      //console.log("sign-in data", response.data);
      if (response.status === 200) {
        // StoreTokenInLocal(res_data.token);
        storeTokenInLocal(response.data.token);
        setLogin(LoginInfo);
        toast.success("user logged in successfully!", {
          bodyClassName: "toastBody",
        });
        navigate("/chats");
      } else {
        toast.error(
          response.data.message
            ? response.data.message
            : response.data.extraDetails,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            bodyClassName: "toastBody",
          }
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message
            ? error.response.data.message
            : error.response.data.extraDetails,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            bodyClassName: "toastBody",
          }
        );
      } else {
        console.log("login error", error);
      }
    }
  };

  return (
    <>
      <form className="p-4" onSubmit={handleSubmit}>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email
          </label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="email"
            value={login.email}
            onChange={handleChange}
            aria-describedby="emailHelp"
          />
        </div>

        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            name="password"
            id="password"
            value={login.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" class="btn auth-button">
          Submit
        </button>
      </form>
    </>
  );
};

export default Login;
