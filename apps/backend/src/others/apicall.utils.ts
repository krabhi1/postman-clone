import { ResultCode, Result, makeResult } from "./utils.js";

export interface RequestQuery<T> {
    path?: string;
    method?: "GET" | "POST" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    authToken?: string;
    onSuccess?: (res: Response, result: Result<T>) => Promise<Result<T>>;
    onFail?: (res: Response, result: Result<T>) => Promise<Result<T>>;
}

export function isHttpOk(request: Result<any> | number) {
    if (typeof request === "number") {
        return request >= 200 && request < 300;
    }
    return request.code >= 200 && request.code < 300;
}


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


export async function httpApiCall<T>(query: RequestQuery<T>) {
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
        // console.log(url);
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }
        const requestOptions: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            redirect: "follow",
        };
        if (body) {
            requestOptions.body =
                typeof body == "object" ? JSON.stringify(body) : body;
        }
        const response = await fetch(url, requestOptions);
        let result = makeResult<T>({ code: response.status });
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
            code: ResultCode.HTTP_INTERNAL_SERVER_ERROR,
        };
        console.error(error);
        return result;
    }
}