import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Task, TaskStatus } from "@/constants/types";
import NotFound from "./NotFound";

export default function TaskDetail({
  tasks,
  updateTask,
  deleteTask,
}: {
  tasks: Task[];
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | undefined>(
    tasks.find((t) => t.id === id)
  );
  const [title, setTitle] = useState(task?.text || "");
  const [status, setStatus] = useState<TaskStatus>(
    task?.status || "notStarted"
  );

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id);
    setTask(foundTask);
    if (foundTask) {
      setTitle(foundTask.text);
      setStatus(foundTask.status);
    }
  }, [id, tasks]);

  if (!task) return <NotFound />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask({ ...task, text: title, status });
    navigate("/");
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Task Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="notStarted">Not Started</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex justify-between space-x-1">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Task
          </button>
        </div>
      </form>
    </div>
  );
}
