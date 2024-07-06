import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loadResourceForApp } from "./others/utils.ts";
loadResourceForApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </>
);
