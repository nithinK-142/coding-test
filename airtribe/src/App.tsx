import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
// import { tasks as initialTasks } from "./constants/constants";
import { Task, TaskStatus } from "./constants/types";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TaskDetail from "./components/TaskDetail";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [taskList, setTaskList] = useLocalStorage<Task[]>("taskList", []);
  // const [taskList, setTaskList] = useLocalStorage<Task[]>("taskList", initialTasks);
  const [activeCard, setActiveCard] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("taskList");
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    } else {
      setTaskList([]);
      // setTaskList(initialTasks);
      // localStorage.setItem("taskList", JSON.stringify(initialTasks));
    }
  }, []);

  useEffect(() => {
    if (taskList.length > 0) {
      localStorage.setItem("taskList", JSON.stringify(taskList));
    }
  }, [taskList]);

  function handleAddTask(status: TaskStatus, text: string) {
    const newTask: Task = {
      id: uuidv4(),
      text: text,
      status,
    };

    setTaskList([...taskList, newTask]);
  }

  function updateTask(updatedTask: Task) {
    setTaskList(
      taskList.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  function deleteTask(id: string) {
    setTaskList(taskList.filter((task) => task.id !== id));
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

  const TaskListComponent = () => {
    return (
      <div className="flex space-x-8">
        <TaskList
          title="Not Started"
          status="notStarted"
          color="pink"
          tasks={taskList.filter((task) => task.status === "notStarted")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          addTask={handleAddTask}
        />
        <TaskList
          title="In Progress"
          status="inProgress"
          color="yellow"
          tasks={taskList.filter((task) => task.status === "inProgress")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          addTask={handleAddTask}
        />
        <TaskList
          title="Completed"
          status="completed"
          color="green"
          tasks={taskList.filter((task) => task.status === "completed")}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          addTask={handleAddTask}
        />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <main className="flex flex-col items-center text-center">
        <h1 className="text-xl font-semibold my-6">Airtribe</h1>
        <Routes>
          <Route path="/" element={<TaskListComponent />} />
          <Route
            path="/task/:id"
            element={
              <TaskDetail
                tasks={taskList}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
