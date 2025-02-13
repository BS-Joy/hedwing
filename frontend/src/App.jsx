import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
import PublicLayout from "./components/layout/PublicLayout";
import SignUpPage from "./components/signup/SignUpPage";
import ErrorPage from "./components/ErrorPage";
import LogInPage from "./components/login/LogInPage";
import ProfilePage from "./components/profile/ProfilePage";
import SettingsPage from "./components/setting/SettingPage";

function App() {
  const routers = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
    {
      element: <PublicLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/signup",
          element: <SignUpPage />,
        },
        {
          path: "/login",
          element: <LogInPage />,
        },
      ],
    },
    {
      path: "/settings",
      element: <SettingsPage />,
    },
    {
      path: "*", // Catch-all route for 404 errors
      element: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={routers} />;
}

export default App;
