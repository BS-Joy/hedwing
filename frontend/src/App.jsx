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
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  const { theme } = useThemeStore();
  const routers = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          ),
        },
      ],
    },
    // public routes
    {
      element: <PublicLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/signup",
          element: (
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          ),
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <LogInPage />
            </PublicRoute>
          ),
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
