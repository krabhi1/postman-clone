import { findFalsyKeys } from "common-utils";
export const env = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
  SERVER_URL: import.meta.env.VITE_SERVER_URL as string,
};

const out = findFalsyKeys(env);
if (out.length > 0) {
  throw new Error(
    "env variable not found: " + out.join(", ") + ". Please check .env file."
  );
}

console.log({ env });