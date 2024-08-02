import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Books from "./components/Books.tsx";
import Home from "./components/Home.tsx";
import Customer from "./components/Customer.tsx";
import Sales from "./components/Sales.tsx";
import Stock from "./components/Stock.tsx";
import BookISBN from "./components/BookISBN.tsx";
import BookMaster from "./components/BookMaster.tsx";
import OpBalance from "./components/OpBalance.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="books/" element={<Books />}>
        <Route path="book-master" element={<BookMaster />} />
        <Route path="op-balance" element={<OpBalance />} />
        <Route path="book-isbn" element={<BookISBN />} />
      </Route>
      <Route path="customer" element={<Customer />} />
      <Route path="stock" element={<Stock />} />
      <Route path="sales" element={<Sales />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
