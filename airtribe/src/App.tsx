import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import { tasks as initialTasks } from "./constants/constants";
import { Task, TaskStatus } from "./constants/types";

function App() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [activeCard, setActiveCard] = useState<Task | null>(null);

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

  function onDrop(newStatus: TaskStatus, newPosition: number) {
    if (activeCard !== null) {
      const updatedTasks = taskList.filter((task) => task.id !== activeCard.id);
      updatedTasks.splice(newPosition, 0, { ...activeCard, status: newStatus });
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
        />
        <TaskList
          title="In Progress"
          status="inProgress"
          color="yellow"
          tasks={taskList.filter((task) => task.status === "inProgress")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
        />
        <TaskList
          title="Completed"
          status="completed"
          color="green"
          tasks={taskList.filter((task) => task.status === "completed")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
        />
      </div>
    </main>
  );
}

export default App;
