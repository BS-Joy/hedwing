import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
function App() {
  const routers = createBrowserRouter([
    {
      // path: "/",
      // Component: (

      // ),
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routers} />;
}

export default App;
