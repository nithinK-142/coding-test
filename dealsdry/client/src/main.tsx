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
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import CourseList from "./components/CourseList.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path=""
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<Login />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="employees-list"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="create-employee"
        element={
          <ProtectedRoute>
            <CreateEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="edit-employee/:id"
        element={
          <ProtectedRoute>
            <EditEmployee />
          </ProtectedRoute>
        }
      />

      <Route
        path="course-list"
        element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
