import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <h4 className="text-3xl">404</h4>
      <p>Task not found</p>
      <button
        className="text-blue-500 hover:underline mt-4"
        onClick={() => navigate("/")}
      >
        Back
      </button>
    </div>
  );
}
