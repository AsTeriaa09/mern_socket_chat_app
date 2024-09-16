import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context/Context";

const LogOut = () => {
  const { LogOutUser } = useGlobalContext();

  useEffect(() => {
    LogOutUser();
  }, [LogOutUser]);
  return (
    <div>
      <Navigate to="/" />
    </div>
  );
};

export default LogOut;
