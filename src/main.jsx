import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./routes/Router";
import { RouterProvider } from "react-router-dom";
import "../src/../index.css";

// Handle GitHub Pages path
const basename = import.meta.env.BASE_URL;
const params = new URLSearchParams(window.location.search);
const path = params.get('p');
if (path) {
  const newPath = path.startsWith('/') ? path : `/${path}`;
  window.history.replaceState({}, '', basename + newPath);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} basename={basename} />
  </React.StrictMode>
);
