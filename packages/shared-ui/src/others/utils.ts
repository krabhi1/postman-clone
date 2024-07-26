import { createBrowserRouter } from "react-router-dom";
import { updateEnv } from "../configs/env.config";
import { setRouter, routes } from "./pageRouter";
import { Children, memo, ReactElement, ReactNode, useRef, useState } from "react";
import React from "react";
import { RequestItem } from "common-utils/types";
import { KeyValue } from "common-utils";
import parseHeaders from "parse-headers";
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
  // const response = fetch(request.url, {
  //   method: request.method,
  //   signal,
  //   headers: request.headers,
  //   body: makeBody()
  // })
  const response = serverFetch(request.url, request.method, request.headers, makeBody(), signal);

  return { controller, response };

}

export function useRequestFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [resInfo, setResInfo] = useState<{ contentType?: string, data: any, size: number, headers: any }>();
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
      const pmc_headers = parseHeaders(headers.get('pmc_headers') || '')
      const { size: sizeStr, status, statusCode } = parseHeaders(headers.get('pmc_others') || '') as KeyValue<string>
      const size = sizeStr ? parseInt(sizeStr) : 0

      if (isTextBased) {
        const text = await res.text();
        setResInfo({ contentType, data: text, size, headers });
      }
      else {
        const buffer = await res.arrayBuffer();
        // const data= new Uint8Array(buffer)
        setResInfo({ contentType, data: 'some binary data', size, headers: pmc_headers });
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

export function objToKeyValuesString(obj: Record<string, string>) {
  return Object.keys(obj).map(key => `${key}=${obj[key]}`).join(',')
}


export function serverFetch(
  url: string,
  method: string,
  headers: Record<string, string>,
  body: any,
  signal: any
) {
  const serverUrl = "http://localhost:3000/api/v1/fetch";

  const pmc_headers = objToKeyValuesString(headers);
  const pmc_others = objToKeyValuesString({ method });
  const pmc_url = url;
  return fetch(serverUrl, {
    method: "POST",
    signal,
    headers: {
      pmc_headers,
      pmc_others,
      pmc_url,
    },
    body: body,
  });
}




//for react 
