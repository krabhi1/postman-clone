import { createBrowserRouter } from "react-router-dom";
import { updateEnv } from "../configs/env.config";
import { setRouter, routes } from "./pageRouter";
import { Children, memo, ReactElement, ReactNode } from "react";
import React from "react";

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


export function reactChildren<T>(props: {
  children: ReactNode,
  filter?: (child: ReactElement<T>) => boolean
}) {
  return Children.toArray(props.children).filter(
    (e): e is ReactElement<T> => {
      return React.isValidElement(e) && (!props.filter || props.filter(e as ReactElement<T>));
    }
  ) as ReactElement<T>[];
}