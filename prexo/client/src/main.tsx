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
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Order from "./pages/Order.tsx";
import OrderImport from "./pages/OrderImport.tsx";
import Delivery from "./pages/Delivery.tsx";
import DeliveryInport from "./pages/Delivery-Import.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import Bag from "./pages/Bag.tsx";
import BaggingAgent from "./pages/BaggingAgent.tsx";
import BOT from "./pages/BOT.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="order/"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="order/bulk-import"
        element={
          <ProtectedRoute>
            <OrderImport />
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
      <Route
        path="delivery/bulk-import"
        element={
          <ProtectedRoute>
            <DeliveryInport />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<Login />} />
      <Route
        path="bag"
        element={
          <ProtectedRoute>
            <Bag />
          </ProtectedRoute>
        }
      />
      <Route
        path="bagging"
        element={
          <ProtectedRoute>
            <BaggingAgent />
          </ProtectedRoute>
        }
      />
      <Route
        path="bot"
        element={
          <ProtectedRoute>
            <BOT />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
