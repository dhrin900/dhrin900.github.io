import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./routes/Router";
import { RouterProvider } from "react-router-dom";
import "../index.css";

const basename = import.meta.env.MODE === 'production' ? '/dhrin900.github.io' : '';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} basename={basename} />
  </React.StrictMode>
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} basename={basename} />
  </React.StrictMode>
);
