import { createBrowserRouter } from "react-router-dom";
import { updateEnv } from "../configs/env.config";
import { setRouter, routes } from "./pageRouter";
import { memo } from "react";

export function loadViteEnv() {
  let _env = {
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    GOOGLE_REDIRECT_URL: import.meta.env.VITE_GOOGLE_REDIRECT_URL as string,
    SERVER_URL: import.meta.env.VITE_SERVER_URL as string,
  };
  updateEnv(_env);
console.log({ _env });

}

export function loadResourceForApp() {
  loadViteEnv();
  setRouter(createBrowserRouter(routes));
}

export type ReactChildren = {
  children?: React.ReactNode;
}

export const genericMemo: <T>(component: T) => T = memo;

