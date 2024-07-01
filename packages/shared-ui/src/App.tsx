import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import { router, routes } from "./others/pageRouter";
import React, { ReactNode } from "react";
import { env, updateEnv } from "./configs/env.config";
import { useLiveStore } from "./configs/liveblocks.config";
import { localStore, useLocalState } from "./store/app.store";
import Login from "./pages/Login";

export default function App() {
  return <RouterProvider router={router} />;
}

