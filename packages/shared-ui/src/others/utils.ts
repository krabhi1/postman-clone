import { createBrowserRouter } from "react-router-dom";
import { updateEnv } from "../configs/env.config";
import { setRouter, routes } from "./pageRouter";
import { Children, memo, ReactElement, ReactNode, useRef, useState } from "react";
import React from "react";
import { RequestItem } from "common-utils/types";

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

export function fetchRequestItem(request: RequestItem) {
  const makeBody = () => {
    if (request.method === 'GET' || request.body.active == 'none') {
      return null;
    }
    if (request.body.active == 'raw') {
      return request.body.raw.text;
    }
    return null
  }
  //fetch and can be cancelled
  const controller = new AbortController();
  const signal = controller.signal;
  const response = fetch(request.url, {
    method: request.method,
    signal,
    headers: request.headers,
    body: makeBody()
  })

  return { controller, response };

}

export function useRequestFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [resInfo, setResInfo] = useState<{ contentType?: string, data: any, size: number }>();
  const [error, setError] = useState<string>();
  const infoRef = useRef<{
    controller: AbortController;
  } | null>(null);

  function clear() {
    setResInfo(undefined);
    setError(undefined);
  }

  function make(reqItem: RequestItem) {
    clear();
    setIsLoading(true);
    const { controller, response } = fetchRequestItem(reqItem);
    infoRef.current = { controller };
    response.then(async (res) => {
      const { headers } = res
      //if headers is any text 
      const contentType = headers.get('content-type') || undefined;
      const isTextBased = isTextBasedContentType(contentType || '');
      const blob = await res.blob();

      if (isTextBased) {
        const text = await blob.text();
        setResInfo({ contentType, data: text, size: blob.size });
      }
      else {
        const buffer = await blob.arrayBuffer();
        setResInfo({ contentType, data: buffer, size: blob.size });
      }
    }).catch((e) => {
      setError(e + '');
    }).finally(() => {
      setIsLoading(false);
    })

  }

  function cancel() {
    infoRef.current?.controller.abort();
  }

  return { isLoading, data: resInfo, error, make, cancel, clear }

}

export function isTextBasedContentType(contentType?: string) {
  if (!contentType) return false;
  return ['json', 'text', 'xml', 'html'].some(type => contentType.includes(type));
}




//for react 
