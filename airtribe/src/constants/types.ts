export type TaskStatus = "notStarted" | "inProgress" | "completed";
export type TaskColor = "pink" | "yellow" | "green";

export type Task = {
  id: string;
  text: string;
  status: TaskStatus;
};
