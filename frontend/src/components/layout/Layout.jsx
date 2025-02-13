import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "./Navbar";

export default function Layout() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
