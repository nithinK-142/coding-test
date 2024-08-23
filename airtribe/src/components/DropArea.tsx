import { TaskStatus } from "@/constants/types";
import { useState } from "react";

export default function DropArea({
  onDrop,
}: {
  onDrop: (status?: TaskStatus, position?: number) => void;
}) {
  const [isOver, setIsOver] = useState(false);
  return (
    <section
      onDragEnter={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => {
        onDrop();
        setIsOver(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={`${
        isOver
          ? "h-10 bg-blue-200 transition-all duration-300 ease-in-out "
          : "h-2"
      }
      rounded-md`}
    />
  );
}
