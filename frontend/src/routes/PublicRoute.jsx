import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const PublicRoute = ({ children }) => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authUser?._id) {
    return <Navigate to="/" replace />;
  }

  return <div>{children}</div>;
};

export default PublicRoute;
