import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import WorkspacePage from "../pages/WorkspacePage";
import NoPage from "../pages/NoPage";
import GoogleRedirect from "../pages/GoogleRedirect";
import About from "../pages/About";
import { Router } from "@remix-run/router";
import ElectronGoogleLogin from "../pages/ElectronGoogleLogin";
function Layout() {
  return <Outlet />;
}
export const routes = [
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
        path: "/login/electron",
        element: <ElectronGoogleLogin />,
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
] as RouteObject[];
export let router: Router;

export function setRouter(r: Router) {
  router = r;
}
