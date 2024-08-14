import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Login from "./components/Login.tsx";
import Home from "./components/Home.tsx";
import EmployeeList from "./components/EmployeeList.tsx";
import EditEmployee from "./components/EditEmployee.tsx";
import CreateEmployee from "./components/CreateEmployee.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="employees-list" element={<EmployeeList />} />
      <Route path="create-employee" element={<CreateEmployee />} />
      <Route path="edit-employee/:id" element={<EditEmployee />} />
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
