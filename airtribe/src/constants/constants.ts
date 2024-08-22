import { Task } from "./types";

export const tasks: Task[] = [
  {
    id: 1,
    text: "Complete project proposal",
    status: "notStarted",
  },
  {
    id: 2,
    text: "Review client feedback",
    status: "inProgress",
  },
  {
    id: 3,
    text: "Update website content",
    status: "completed",
  },
  {
    id: 4,
    text: "Prepare presentation slides",
    status: "notStarted",
  },
  {
    id: 5,
    text: "Schedule team meeting",
    status: "inProgress",
  },
  {
    id: 6,
    text: "Send progress report",
    status: "completed",
  },
];

export const colorClasses = {
  pink: "bg-pink-500/50",
  yellow: "bg-yellow-500/50",
  green: "bg-green-500/50",
};
