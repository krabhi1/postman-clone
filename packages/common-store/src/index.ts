import { safeFetch } from "./localstore";

export function init(
  client: any,
  polyfill: {
    safeFetch: typeof safeFetch;
    getWorkspaces: () => Promise<any>;
  }
) {}
