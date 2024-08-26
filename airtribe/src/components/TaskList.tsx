import React, { useState, useCallback, useRef, useEffect } from "react";
import { TaskStatus, TaskColor, Task } from "@/constants/types";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskHeader from "./TaskHeader";
import DropArea from "./DropArea";

export default function TaskList({
  title,
  status,
  color,
  tasks,
  setActiveCard,
  onDrop,
  addTask,
  openInputStatus,
  setOpenInputStatus,
}: {
  title: string;
  status: TaskStatus;
  color: TaskColor;
  tasks: Task[];
  setActiveCard: (task: Task | null) => void;
  onDrop: (status: TaskStatus, position: number) => void;
  addTask: (status: TaskStatus, text: string) => void;
  openInputStatus: TaskStatus | null;
  setOpenInputStatus: (status: TaskStatus | null) => void;
}) {
  const [newTaskText, setNewTaskText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNewClick = useCallback(() => {
    setOpenInputStatus(status);
  }, [setOpenInputStatus, status]);

  const handleAddTask = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newTaskText.trim() !== "") {
        addTask(status, newTaskText);
        setNewTaskText("");
        setOpenInputStatus(null);
      }
    },
    [addTask, newTaskText, status, setOpenInputStatus]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTaskText(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (openInputStatus === status && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInputStatus, status]);

  const isInputOpen = openInputStatus === status;

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

      {isInputOpen && (
        <form onSubmit={handleAddTask}>
          <input
            ref={inputRef}
            type="text"
            name="newTaskText"
            value={newTaskText}
            onChange={handleInputChange}
            placeholder="Enter a new task"
            className="border rounded px-2 py-1.5 w-full text-black"
          />
        </form>
      )}
      {!isInputOpen && (
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
