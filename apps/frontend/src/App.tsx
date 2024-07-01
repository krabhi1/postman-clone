import { RouterProvider } from "react-router-dom";
// import { router } from "./others/pageRouter";
import React, { ReactNode } from "react";
import { env } from "./configs/env.config";


import { Init } from "ui2";

// export default function App() {
//   return <RouterProvider router={router} />;
// }

const { Component, router, localStore } = Init({
  env: {
    SERVER_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: env.GOOGLE_REDIRECT_URI,
  },
  mode: "browser",
});
// router.navigate("/login");
console.log(localStore.getState());
localStore.subscribe((state) => {
  console.log(state);
});

export default function App() {
  return (
    <>
      <Component />
    </>
  );
}
