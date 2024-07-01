import { saveAuthToken, sleep } from "common-utils";
import { useEffect } from "react";
import { userApi } from "../api/user.api";
import { router } from "../others/pageRouter";

export default function GoogleRedirect() {
  useEffect(() => {
    const init = async () => {
      //get code
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      console.log("url",url,code)
      // alert(code);
      if (code) {
        const sResult = await userApi.signInWithGoogle(code);
        console.log({ sResult });
        if (sResult.data) {
          //redirect to postman
          const url="postman-clone://token="+sResult.data.token
          const link=document.createElement("a")
          link.href=url
          document.body.appendChild(link)
          link.click()
          //set token
          saveAuthToken(sResult.data.token);
          //redirect to home
          router.navigate("/home", { replace: true });
          return;
        }

        alert("try to login again, " + sResult.message);
        await sleep(1500);
        router.navigate("/login", { replace: true });
        return;
      }
      const error = url.searchParams.get("error") || "invalid code";
      alert("try to login again , " + error);
      await sleep(1500);
      router.navigate("/login", { replace: true });
    };
    init();
  }, []);
  return <div>Loading...</div>;
}
