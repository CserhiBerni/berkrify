import LandingPage from "./pages/landing/LandingPage";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import UploadForm from "./components/uploadform/UploadForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    //    errorElement: <ErrorPage/>
  },
  {
    path: "/upload",
    element: <UploadForm />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
