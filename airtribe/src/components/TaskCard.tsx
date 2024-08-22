import { Task } from "@/constants/types";

export default function TaskCard({
  task,
  setActiveCard,
}: {
  task: Task;
  setActiveCard: (task: Task | null) => void;
}) {
  return (
    <div
      className="border-2 shadow-md my-0.5 py-2 px-2 rounded-md active:opacity-70 active:border-black active:cursor-grab"
      draggable
      onDragStart={() => setActiveCard(task)}
      onDragEnd={() => setActiveCard(null)}
    >
      <p className="text-left">{task.text}</p>
    </div>
  );
}
