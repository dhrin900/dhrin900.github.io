import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./routes/Router";
import { RouterProvider } from "react-router-dom";
import "../index.css";

const basename = import.meta.env.MODE === 'production' ? '/dhrin900.github.io' : '';
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', basename);

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
