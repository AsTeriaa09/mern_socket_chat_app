import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Context";
import { toast } from "react-toastify";
import "../styles/chatStyle.css"


const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
const signUpurl = import.meta.env.VITE_SIGNUP_URL;
const updatePicUri = import.meta.env.VITE_UPDATEPIC_URL;

const SignUp = () => {
  const fileInputRef = useRef(null);
  const { storeTokenInLocal } = useGlobalContext();
  const navigate = useNavigate();
  const signUpInfo = { name: "", email: "", password: "" };
  const [picture, setPicture] = useState("");
  const [signUp, setSignUp] = useState(signUpInfo);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleChange = (e) => {
    let name = e.target.name;
    //let value = e.target.value;
    let value =
      e.target.name === "picture" ? e.target.files[0] : e.target.value;
    setSignUp({ ...signUp, [name]: value });
  };

  const postDetails = async (pictureFile) => {
    if (!pictureFile) {
      toast.warning("Please select an image!", {
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
    //console.log(pictureFile);
    if (pictureFile.type === "image/jpeg" || pictureFile.type === "image/png") {
      const data = new FormData();
      data.append("file", pictureFile);
      data.append("upload_preset", "ChatterBox");
      data.append("cloud_name", "dcji04nuv");
      setLoadingImage(true);
      try {
        const res = await axios.post(
          cloudinaryUrl,
          data
        );
        setPicture(res.data.secure_url);
        //console.log("Cloudinary response:", res.data);
        setLoadingImage(false);
      } catch (err) {
        console.error("Error uploading image:", err);
        toast.error("Please select a valid image (JPEG or PNG)!", {
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
        setLoadingImage(false);
      }
    } else {
      toast.error("Please select a valid image (JPEG or PNG)!", {
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

    if (!picture && !loadingImage) {
      toast.error("Please upload a profile picture!", {
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
    //console.log("SignUp data before sending:", signUp);
    try {
      const response = await axios.post(
        signUpurl,
        { ...signUp, picture },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // const res_data = await response.json();
      //console.log("Response data:", response.data);
      if (response.status === 200) {
        storeTokenInLocal(response.data.token);
        setSignUp(signUpInfo);
        setPicture("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("user created successfully!", {
          bodyClassName: "toastBody",
        });
        await axios.put(updatePicUri, {
          userId: response.data.userId,
          picture,
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
        console.log("sign up error", error);
      }
    }
  };
  return (
    <>
      <form className=" signup p-4" onSubmit={handleSubmit}>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Name
          </label>
          <input
            type="text"
            class="form-control"
            name="name"
            id="name"
            value={signUp.name}
            onChange={handleChange}
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email
          </label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="email"
            value={signUp.email}
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
            value={signUp.password}
            onChange={handleChange}
          />
        </div>

        <div class="mb-4">
          <label for="formFile" class="form-label">
            Upload Image
          </label>
          <input
            class="form-control"
            type="file"
            id="picture"
            name="picture"
            //value={signUp.picture}
            onChange={(e) => postDetails(e.target.files[0])}
            ref={fileInputRef}
          />
        </div>

        <button type="submit" class="btn auth-button" disabled={loadingImage}>
          SIGN UP
        </button>
      </form>
    </>
  );
};

export default SignUp;
