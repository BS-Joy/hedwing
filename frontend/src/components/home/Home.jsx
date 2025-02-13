import React, { useEffect } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function Home() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);
  console.log(isCheckingAuth);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }
  return (
    <>
      <h1 className="text-red-500 text-4xl">Hello world</h1>
      <button className="btn btn-error">Error</button>
      <Link className="link link-success" to="/signup">
        To Signup page
      </Link>
    </>
  );
}
