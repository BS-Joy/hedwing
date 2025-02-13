import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { Cookies } from "react-cookie";

export default function PublicLayout() {
  const { authUser, checkAuth, isCheckingAuth, authError } = useAuthStore();
  const cookies = new Cookies();

  const token = cookies.get("jwt");

  useEffect(() => {
    checkAuth(); // Ensure checkAuth is stable in the store
  }, []); // Removed checkAuth from dependencies to avoid potential infinite loops

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* <h1>Public layout</h1> */}
      <Outlet />
    </>
  );
}
