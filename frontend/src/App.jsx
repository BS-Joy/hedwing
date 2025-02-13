import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
import PublicLayout from "./components/layout/PublicLayout";
import SignUpPage from "./components/signup/page/SignUpPage";
import ErrorPage from "./components/ErrorPage";
import LogInPage from "./components/login/page/LogInPage";
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
  return <RouterProvider router={routers} />;
}

export default App;
