import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Login from "./components/Login.tsx";
import Home from "./components/Home.tsx";
import Order from "./components/Order.tsx";
import Delivery from "./components/Delivery.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="order"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="delivery"
        element={
          <ProtectedRoute>
            <Delivery />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<Login />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
