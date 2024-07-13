import { useEffect } from "react";
import { env } from "../configs/env.config";

export default function ElectronGoogleLogin() {
  function login() {
    const { GOOGLE_CLIENT_ID: VITE_GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL: VITE_GOOGLE_REDIRECT_URI } = env;
    const auth_url = `https://accounts.google.com/o/oauth2/auth?client_id=${VITE_GOOGLE_CLIENT_ID}&redirect_uri=${VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/userinfo.email&access_type=offline`;
    window.open(auth_url, "_self");
  }
  useEffect(()=>{
    login()
  },[])
  return (
    <div className="box full center">
      {/* <button onClick={login}>Login with Google</button> */}
    </div>
  );
}
