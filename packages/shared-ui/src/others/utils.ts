import { createBrowserRouter } from "react-router-dom";
import { updateEnv } from "../configs/env.config";
import { setRouter, routes } from "./pageRouter";

export function loadViteEnv() {
  let _env = {
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
    SERVER_URL: import.meta.env.VITE_SERVER_URL as string,
  };
  updateEnv(_env);
}

export function loadResourceForApp(){
  loadViteEnv();
  setRouter(createBrowserRouter(routes));
}

export type ReactChildren={
  children?: React.ReactNode;
}


