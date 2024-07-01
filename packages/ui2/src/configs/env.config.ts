import { findFalsyKeys } from "common-utils";
// @ts-ignore
export type Env = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_REDIRECT_URI: string;
  SERVER_URL: string;
};
// export let  env = {
//   GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
//   GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
//   SERVER_URL: import.meta.env.VITE_SERVER_URL as string,
// };
export let env: Env = {
  GOOGLE_CLIENT_ID: "",
  GOOGLE_REDIRECT_URI: "",
  SERVER_URL: "",
};

export function updateEnv(newEnv: typeof env) {
  env = newEnv;
}

// const out = findFalsyKeys(env, ["", "undefined", "null"]);
// if (out.length > 0) {
//   throw new Error(
//     "env variable not found: " + out.join(", ") + ". Please check .env file."
//   );
// }

console.log({ env });
