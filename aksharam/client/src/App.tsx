import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
