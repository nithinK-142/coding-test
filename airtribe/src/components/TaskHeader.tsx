import { colorClasses } from "@/constants/constants";
import { Task, TaskColor } from "@/constants/types";
import { Ellipsis, Plus } from "lucide-react";

export default function TaskHeader({
  title,
  color,
  tasks,
}: {
  title: string;
  color: TaskColor;
  tasks: Task[];
}) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <h2 className={`${colorClasses[color]} rounded-sm px-1.5 text-sm`}>
          {title}
        </h2>
        <p className="ml-2">{tasks.length}</p>
      </div>
      <div className="flex items-center">
        <Ellipsis />
        <Plus />
      </div>
    </div>
  );
}
