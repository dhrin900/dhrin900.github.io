import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./routes/Router";
import { RouterProvider } from "react-router-dom";
import "../src/../index.css";

// Add this block before rendering
const params = new URLSearchParams(window.location.search);
const path = params.get('p');
if (path) {
  window.history.replaceState({}, '', path);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
