import { Link, Outlet } from "react-router-dom";
import OrangeLine from "./OrangeLine";

export default function Books() {
  return (
    <div className="w-[80%] mx-auto ">
      <div className="flex items-center">
        <h1 className="text-orange-500 text-xl font-semibold">Books menu:</h1>
        <ul className="flex text-sm">
          <li className="px-4 py-1.5">
            <Link to="book-master">Book Master</Link>
          </li>
          <li className="px-4 py-1.5">
            <Link to="op-balance">Op. Balance</Link>
          </li>
          <li className="px-4 py-1.5">
            <Link to="book-isbn">Book ISBN</Link>
          </li>
        </ul>
      </div>
      <OrangeLine />

      <Outlet />
    </div>
  );
}
