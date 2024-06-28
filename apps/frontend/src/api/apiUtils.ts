import { RequestQuery, makeResult, Result, getAuthToken, saveAuthToken } from "common-utils";
import { router } from "../others/pageRouter";
import { userApi } from "./user.api";


function objectToQueryString(obj: { [key: string]: any }): string {
  const parts: string[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      parts.push(`${key}=${value}`);
    }
  }
  return parts.join("&");
}

export async function apiCall<T>(query: RequestQuery<T>) {
  try {
    const {
      path,
      method = "GET",
      headers = {
        "Content-Type": "application/json",
      },
      query: params = {},
      body,
      authToken,
    } = query;

    // Construct the URL with query parameters
    let url = path || "";
    url += "?" + objectToQueryString(params);
    console.log(url);
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    if (body) {
      requestOptions.body =
        typeof body == "object" ? JSON.stringify(body) : body;
    }
    const response = await fetch(url, requestOptions);
    let result = makeResult<T>({ status: response.status });
    if (response.ok) {
      if (query.onSuccess) {
        result = await query.onSuccess(response, result);
      } else {
        result.data = await response.json();
      }
    } else {
      if (query.onFail) {
        result = await query.onFail(response, result);
      } else {
        result = await response.json();
      }
    }
    return result;
  } catch (error: any) {
    const result: Result<T> = {
      message: error.message,
      error,
      status: 500,
    };
    console.error(error);
    return result;
  }
}
export function serverUrl() {
  return "http://localhost:3000";
}

export async function serverApiCall<T>(query: RequestQuery<T>) {
  // query.path = serverUrl() + query.path;
  return apiCall<T>({
    ...query,
    path: serverUrl() + query.path,
    onSuccess: async (res, result) => {
      const sResult = await res.json();
      result.data = sResult.data;
      result.message = sResult.message;
      result.error = sResult.error;
      result.status = res.status;
      result.code = sResult.code;
      return result;
    },
    onFail: async (res, result) => {
      const sResult = await res.json();
      result.data = sResult.data;
      result.message = sResult.message;
      result.error = sResult.error;
      result.status = res.status;
      result.code = sResult.code;
      return result;
    },
  });
}

export async function authSafeApiCall<T>(query: RequestQuery<T>) {
  query.authToken = getAuthToken()!;
  console.log("auth token", getAuthToken());

  let result = await serverApiCall<T>(query);

  if (result.status == 401) {
    //token is expired so need one
    const tResult = await userApi.refreshAccessToken();
    if (!tResult.data) {
      //redirect to login
      router.navigate("/login", { replace: true });
      // appStore.getState().setAuth(false);
    } else {
      //save new token
      saveAuthToken(tResult.data.token);
      query.authToken = tResult.data.token;
      // appStore.getState().setAuth(true);
      result = await serverApiCall<T>(query);
    }
  }
  return result;
}
