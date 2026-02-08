import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
import PublicLayout from "./components/layout/PublicLayout";
import SignUpPage from "./components/signup/SignUpPage";
import ErrorPage from "./components/ErrorPage";
import LogInPage from "./components/login/LogInPage";
import ProfilePage from "./components/profile/ProfilePage";
import SettingsPage from "./components/setting/SettingPage";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { theme } = useThemeStore();
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
        {
          path: "/settings",
          element: <SettingsPage />,
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
      path: "*", // Catch-all route for 404 errors
      element: <ErrorPage />,
    },
  ]);
  return (
    <div data-theme={theme} className="font-philosopher">
      <RouterProvider router={routers} />
    </div>
  );
}

export default App;
