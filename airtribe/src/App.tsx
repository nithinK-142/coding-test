import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import { tasks as initialTasks } from "./constants/constants";
import { Task, TaskStatus } from "./constants/types";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [activeCard, setActiveCard] = useState<Task | null>(null);
  const [newTaskTexts, setNewTaskTexts] = useState<Record<TaskStatus, string>>({
    notStarted: "",
    inProgress: "",
    completed: "",
  });

  useEffect(() => {
    // localStorage.setItem("taskList", JSON.stringify(initialTasks));
    const savedTasks = localStorage.getItem("taskList");
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    } else {
      setTaskList(initialTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);

  function handleAddTask(status: TaskStatus) {
    if (newTaskTexts[status].trim() === "") return;

    const newTask: Task = {
      id: uuidv4(),
      text: newTaskTexts[status],
      status,
    };

    setTaskList([...taskList, newTask]);
    setNewTaskTexts((prev) => ({ ...prev, [status]: "" }));
  }

  function onDrop(newStatus: TaskStatus, newPosition: number) {
    if (activeCard !== null) {
      const updatedTasks = taskList.filter((task) => task.id !== activeCard.id);
      const tasksInNewStatus = updatedTasks.filter(
        (task) => task.status === newStatus
      );

      // Adjust newPosition if it's at the end of the list
      const adjustedPosition =
        newPosition > tasksInNewStatus.length
          ? tasksInNewStatus.length
          : newPosition;

      // Find the index to insert in the overall list
      const insertIndex = updatedTasks.findIndex((task, index) => {
        return task.status === newStatus && index === adjustedPosition;
      });

      // If no matching index found, append to the end of the status group
      const finalInsertIndex =
        insertIndex === -1 ? updatedTasks.length : insertIndex;

      updatedTasks.splice(finalInsertIndex, 0, {
        ...activeCard,
        status: newStatus,
      });
      setTaskList(updatedTasks);
      setActiveCard(null);
    }
  }

  return (
    <main className="flex flex-col items-center text-center">
      <h1 className="text-xl font-semibold my-6">Airtribe</h1>
      <div className="flex space-x-8">
        <TaskList
          title="Not Started"
          status="notStarted"
          color="pink"
          tasks={taskList.filter((task) => task.status === "notStarted")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          addTask={handleAddTask}
          newTaskText={newTaskTexts["notStarted"]}
          setNewTaskText={(text: string) =>
            setNewTaskTexts((prev) => ({ ...prev, ["notStarted"]: text }))
          }
        />
        <TaskList
          title="In Progress"
          status="inProgress"
          color="yellow"
          tasks={taskList.filter((task) => task.status === "inProgress")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          addTask={handleAddTask}
          newTaskText={newTaskTexts["inProgress"]}
          setNewTaskText={(text: string) =>
            setNewTaskTexts((prev) => ({ ...prev, ["inProgress"]: text }))
          }
        />
        <TaskList
          title="Completed"
          status="completed"
          color="green"
          tasks={taskList.filter((task) => task.status === "completed")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          addTask={handleAddTask}
          newTaskText={newTaskTexts["completed"]}
          setNewTaskText={(text: string) =>
            setNewTaskTexts((prev) => ({ ...prev, ["completed"]: text }))
          }
        />
      </div>
    </main>
  );
}
