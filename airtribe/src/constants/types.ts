export type TaskStatus = "notStarted" | "inProgress" | "completed";
export type TaskColor = "pink" | "yellow" | "green";

export type Task = {
  id: number;
  text: string;
  status: TaskStatus;
};
