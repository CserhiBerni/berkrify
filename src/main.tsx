import LandingPage from "./pages/landing/LandingPage";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import UploadForm from "./components/uploadform/UploadForm";
import AlbumPage from "./pages/album/AlbumPage";
import Login from "./pages/logreg/login/login";
import Register from "./pages/logreg/register/register";
import { PlayerProvider } from "./components/services/service/PlayerContext";
import { PlaylistProvider } from "./components/services/service/PlaylistContext";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import PlaylistsPage from "./pages/playlist/Playlists";
import ProfilePage from "./pages/profile/ProfilePage";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    //errorElement: <ErrorPage/>
  },
  {
    path: "/upload",
    element: (
      <AdminRoute>
        <UploadForm />
      </AdminRoute>
    ),
  },
  {
    path: "/album/:albumName",
    element: <AlbumPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/playlist/:playlistId",
    element: <PlaylistPage />
  },
  {
    path: "/playlists",
    element: (
      <ProtectedRoute>
        <PlaylistsPage />
      </ProtectedRoute>
    )
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlayerProvider>
      <PlaylistProvider>
        <RouterProvider router={router} />
      </PlaylistProvider>
    </PlayerProvider>
  </React.StrictMode>
);