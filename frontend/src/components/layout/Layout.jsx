import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "./Navbar";
import { useThemeStore } from "../../store/useThemeStore";

export default function Layout() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

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

  console.log(theme);

  return (
    <div data-theme={theme}>
      <Navbar />
      <Outlet />
    </div>
  );
}
