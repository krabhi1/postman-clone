import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import WorkspacePage from "../pages/WorkspacePage";
import NoPage from "../pages/NoPage";
import GoogleRedirect from "../components/GoogleRedirect";
import About from "../pages/About";
function Layout() {
  return <Outlet />;
}
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        //redirect to home
        path: "/",
        element: <Navigate to="/home" replace={true} />,
      },

      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/workspace/:id",
        element: <WorkspacePage />,
      },
      {
        path: "/redirect",
        element: <GoogleRedirect />,
      },
      {
        path: "/about",
        element: <About />,
      },

      //collection
      // { path: "collections", element: <CollectionApp /> },

      { path: "*", element: <NoPage /> },
    ],
  },
]);
