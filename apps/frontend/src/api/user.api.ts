import { getAuthToken } from "common-utils";
import { User } from "common-utils/types";
import { serverApiCall, authSafeApiCall } from "./apiUtils";

export const userApi = {
  // googleSignIn: async (code:string) => {
  //   const result = await serverApiCall<{ token: string }>({
  //     method: "POST",
  //     path: "/users/signin",
  //     body: { email, password },
  //   });
  //   return result;
  // },
  // signUp: async (user: Omit<User, "id">) => {
  //   const result = await apiCall<User>({
  //     method: "POST",
  //     path: "/user/signup",
  //     body: user,
  //   });
  //   if (result.data) {
  //     result.data.email;
  //   }
  // },

  signInWithGoogle: async (code: string) => {
    const result = await serverApiCall<{ token: string }>({
      method: "POST",
      path: "/api/v1/user/google/signin",
      body: {
        code,
      },
    });
    return result;
  },

  getProfile: async () => {
    const result = await authSafeApiCall<User>({
      method: "GET",
      path: "/api/v1/user/profile",
    });
    return result;
  },
  

  refreshAccessToken: async () => {
    const result = await serverApiCall<{ token: string }>({
      method: "POST",
      path: "/api/v1/user/refresh/access_token",
      body: {
        token: getAuthToken(),
      },
    });
    return result;
  },
};
