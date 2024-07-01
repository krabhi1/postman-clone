import { ReactNode } from "react";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import { Router } from "@remix-run/router";

import { env, updateEnv } from "../configs/env.config";
import { useLiveStore } from "../configs/liveblocks.config";
import { router, routes, setRouter } from "../others/pageRouter";
import { useLocalState, localStore } from "../store/app.store";
import Login from "../pages/Login";
//from components
export function Init(options: {
  loginPage?: () => ReactNode;
  fetch?: (data: any) => any;
  env: typeof env;
  mode: "browser" | "electron";
}) {
  //update env
  updateEnv({ ...env, ...options.env });

  const LoginPage = options.loginPage || <Login />;
  let _router: Router;
  if (options.mode === "browser") {
    _router = createBrowserRouter(routes);
  } else {
    _router = createHashRouter(routes);
  }
  setRouter(_router);

  const Component = () => <RouterProvider router={_router} />;

  return {
    Component,
    router: _router,
    useLocalState,
    localStore,
    useLiveStore,
  };
}

function Hello() {
  return <></>;
}
