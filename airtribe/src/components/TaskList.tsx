import { TaskStatus, TaskColor, Task } from "@/constants/types";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskHeader from "./TaskHeader";
import DropArea from "./DropArea";
import React, { useState } from "react";

export default function TaskList({
  title,
  status,
  color,
  tasks,
  setActiveCard,
  onDrop,
  addTask,
  newTaskText,
  setNewTaskText,
}: {
  title: string;
  status: TaskStatus;
  color: TaskColor;
  tasks: Task[];
  setActiveCard: (task: Task | null) => void;
  onDrop: (status: TaskStatus, position: number) => void;
  addTask: (status: TaskStatus) => void;
  newTaskText: string;
  setNewTaskText: (text: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);

  const handleNewClick = () => {
    setShowInput(true);
  };

  const handleAddTask = () => {
    addTask(status);
    setShowInput(false);
  };

  return (
    <div className="flex flex-col w-[20rem] p-2 rounded-md">
      <TaskHeader title={title} color={color} tasks={tasks} />

      <DropArea onDrop={() => onDrop(status, 0)} />
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          <TaskCard task={task} setActiveCard={setActiveCard} />
          {index < tasks.length - 1 && (
            <DropArea onDrop={() => onDrop(status, index + 1)} />
          )}
        </React.Fragment>
      ))}
      <DropArea onDrop={() => onDrop(status, tasks.length)} />

      {showInput && (
        <div>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter a new task"
            className="border rounded px-2 py-1.5 w-full text-black"
          />
          <button
            onClick={handleAddTask}
            className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
          >
            Add Task
          </button>
        </div>
      )}
      {!showInput && (
        <button
          onClick={handleNewClick}
          className="opacity-50 py-2 px-4 rounded inline-flex items-center w-fit mt-2"
        >
          <Plus height={16} /> New
        </button>
      )}
    </div>
  );
}
