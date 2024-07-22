//utils

export type KeyValue<T> = Record<string | symbol | number, T>;

export type Falsy = "null" | "undefined" | "0" | "" | "false";
export function findFalsyKeys(
  obj: KeyValue<any>,
  falsy: Falsy[] = ["null", "undefined"]
) {
  return Object.keys(obj).filter((key) => {
    const value = obj[key];
    let valueType: string = typeof value;
    if (valueType === "object") {
      if (value === null) {
        valueType = "null";
      }
    } else if (valueType === "undefined") {
      valueType = "undefined";
    } else if (valueType === "string") {
      if (value === "") {
        valueType = "";
      }
    } else if (valueType === "boolean") {
      if (value === false) {
        valueType = "false";
      }
    }
    return falsy.includes(valueType as Falsy);
  });
}

//token
export function saveAuthToken(token: string) {
  //check if browser or nodejs
  if (token === null || token === undefined) {
    alert("setting auth-token " + token);
    throw new Error("setting auth-token " + token);
  }
  localStorage.setItem("auth-token", token);
}
export function getAuthToken() {
  return localStorage.getItem("auth-token");
}

export function clearAuthToken() {
  localStorage.removeItem("auth-token");
}

export type PartialWithOmit<T, K extends keyof T> = Partial<Omit<T, K>>;
export type PartialWithMust<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

export type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export type Result<T> = {
  data?: T;
  error?: any;
  message?: string;
  status: number;
  code?: number;
};
export function makeResult<T>(result?: Partial<Result<T>>): Result<T> {
  return {
    status: 200,
    ...result,
  };
}

export function makeErrorResult<T>(result?: Partial<Result<T>>): Result<T> {
  return {
    status: 400,
    ...result,
  };
}

export function makeResultFrom<T>(result: Result<T>, other: Result<any>) { }

export function isOk(request: Result<any>) {
  return request.status >= 200 && request.status < 300;
}

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

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hello() {
  console.log("hello");
}

export function hello2() {
  console.log("hello2");
}
