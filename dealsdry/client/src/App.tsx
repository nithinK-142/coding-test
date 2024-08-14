import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  const isAuthenticated = true;
  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
    </>
  );
}

export default App;
