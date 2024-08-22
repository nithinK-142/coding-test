import { TaskStatus, TaskColor, Task } from "@/constants/types";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskHeader from "./TaskHeader";
import DropArea from "./DropArea";
import React from "react";

export default function TaskList({
  title,
  status,
  color,
  tasks,
  setActiveCard,
  onDrop,
}: {
  title: string;
  status: TaskStatus;
  color: TaskColor;
  tasks: Task[];
  setActiveCard: (task: Task | null) => void;
  onDrop: (status: TaskStatus, position: number) => void;
}) {
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

      <button className="opacity-50 py-2 px-4 rounded inline-flex items-center w-fit">
        <Plus height={16} /> New
      </button>
    </div>
  );
}
