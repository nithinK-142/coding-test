import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="mt-1 w-[80%] mx-auto">
      <ul className="flex space-x-2 text-sm font-medium">
        <li className="px-4 py-1.5 hover:bg-orange-500">
          <Link to="/">Home</Link>
        </li>
        <li className="px-4 py-1.5 hover:bg-orange-500">
          <Link to="/books">Books</Link>
        </li>
        <li className="px-4 py-1.5 hover:bg-orange-500">
          <Link to="/customer">Customer</Link>
        </li>
        <li className="px-4 py-1.5 hover:bg-orange-500">
          <Link to="/stock">Stock</Link>
        </li>
        <li className="px-4 py-1.5 hover:bg-orange-500">
          <Link to="/sales">Sales</Link>
        </li>
      </ul>
      <div className="bg-orange-400 py-[1px] mx-auto"></div>
    </nav>
  );
}
