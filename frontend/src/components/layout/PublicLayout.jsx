import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import ErrorPage from "../ErrorPage";

export default function PublicLayout() {
  const { authUser, checkAuth, isCheckingAuth, authError } = useAuthStore();

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

  //   if (authError) {
  //     return <ErrorPage errorProp="Something went wrong on authentication!" />;
  //   }

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
