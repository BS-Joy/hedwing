import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //   console.log(authUser);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <div>{children}</div>;
};

export default PrivateRoute;
