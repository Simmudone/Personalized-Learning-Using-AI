// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(<App />);


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/*
  Clear localStorage ONLY when dev server starts
  Not on refresh, not on navigation.
*/
const DEV_FLAG = "dev_session_started";

if (!sessionStorage.getItem(DEV_FLAG)) {
  localStorage.removeItem("progressCourses");
  localStorage.removeItem("completedCourses");
  sessionStorage.setItem(DEV_FLAG, "true");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);