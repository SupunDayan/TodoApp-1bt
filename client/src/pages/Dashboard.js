import "../pages/Dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId";
import { useGetUserName } from "../hooks/useGetUserName";
import { getFormattedDate } from "../utils/getFormattedDate";

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [task, setTask] = useState("");
  const [dueDateTime, setdueDateTime] = useState(getFormattedDate(new Date()));
  const [taskId, setTaskId] = useState("");
  const [sortedTasks, setSortedTasks] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [highlightTodayTasks, setHighlightTodayTasks] = useState(false);

  const userId = useGetUserId();
  const userName = useGetUserName();

  const isDueDateToday = (dueDateTime) => {
    const today = new Date();
    const dueDate = new Date(dueDateTime);
    const todayDate = today.toISOString().split("T")[0];
    const dueDateDate = dueDate.toISOString().split("T")[0];
    return todayDate === dueDateDate;
  };

  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  useEffect(() => {
    const getAllTasksByUserId = async () => {
      try {
        const response = await axios.get("http://localhost:3001/task/getAll", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const tasksWithIsToday = response.data.map((task) => ({
          ...task,
          isToday: isDueDateToday(task.dueDateTime),
        }));
        setTasks(tasksWithIsToday);
      } catch (err) {
        console.error(err);
      }
    };
    getAllTasksByUserId();
  }, []);

  const sortTasksByDate = (tasks) => {
    return tasks.sort(
      (a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime)
    );
  };

  const sortHandler = () => {
    if (!isSorting) {
      setIsSorting(true);
      const sorted = sortTasksByDate(tasks);
      setSortedTasks(sorted);
      setIsSorting(false);
    }
  };

  const highlightTodayTasksHandler = () => {
    setHighlightTodayTasks(!highlightTodayTasks);
  };

  const createTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/task/create",
        { task, dueDateTime, taskOwner: userId },
        headers
      );

      const tasksWithIsToday = {
        ...response.data,
        isToday: isDueDateToday(response.data.dueDateTime),
      };

      setTasks([...tasks, tasksWithIsToday]);

      setIsUpdating(false);
      setPopupActive(false);
      setTask("");
      setdueDateTime(getFormattedDate(new Date()));
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/task/delete/${taskId}`,
        headers
      );
      setTasks((tasks) =>
        tasks.filter((task) => task._id !== response.data._id)
      );
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const updateTask = async (taskId) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/task/update",
        { taskId, task, dueDateTime },
        headers
      );

      setTasks((tasks) =>
        tasks.map((task) => {
          if (task._id === response.data._id) {
            task.task = response.data.task;
            task.dueDateTime = response.data.dueDateTime;
            task.isToday = isDueDateToday(response.data.dueDateTime);
          }
          return task;
        })
      );

      setIsUpdating(false);
      setPopupActive(false);
      setTask("");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const updateMode = (taskId, task, dueDateTime) => {
    setIsUpdating(true);
    setPopupActive(true);
    setTask(task);
    setdueDateTime(getFormattedDate(dueDateTime));
    setTaskId(taskId);
  };

  const closePopup = () => {
    setIsUpdating(false);
    setPopupActive(false);
    setTask("");
    setdueDateTime(getFormattedDate(new Date()));
  };

  const tasksToMap = isSorting ? sortedTasks : tasks;

  return (
    <div className="Dashboard">
      <h1>Welcome, {userName}</h1>
      {tasks.length > 0 ? <h4>Your Tasks</h4> : <h4>You have no Tasks</h4>}
      <div className="button-container">
        <button onClick={sortHandler} disabled={isSorting}>
          Sort
        </button>
        <button onClick={highlightTodayTasksHandler}>
          {highlightTodayTasks ? "All Tasks" : "Today's Tasks"}
        </button>
      </div>
      <div className="tasks">
        {tasksToMap.map((task) => (
          <div
            className={
              highlightTodayTasks && task.isToday
                ? "task highlighted grid-container"
                : "task grid-container"
            }
            key={task._id}
          >
            <div className="box grid-item">
              <div id="task" className="text">
                {task.task}
              </div>
            </div>
            <div className="date-time-container  grid-item">
              <div id="task" className="text">
                {new Date(task.dueDateTime).toLocaleString()}
              </div>
            </div>

            <div className="controls  grid-item">
              <div
                className="update-task"
                onClick={() =>
                  updateMode(task._id, task.task, task.dueDateTime)
                }
              >
                ../
              </div>
              <div className="delete-task" onClick={() => deleteTask(task._id)}>
                x
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => closePopup()}>
            x
          </div>
          <div className="content">
            {isUpdating ? <h3>Update Task</h3> : <h3>Add Task</h3>}
            <form>
              <input
                type="task"
                className="add-task-input"
                value={task}
                onChange={(event) => setTask(event.target.value)}
              />
              <div style={{ padding: "20px" }}></div>
              <input
                type="datetime-local"
                className="add-task-input"
                id="datetimeInput"
                name="datetimeInput"
                value={dueDateTime}
                min={getFormattedDate(new Date())}
                onChange={(event) => setdueDateTime(event.target.value)}
              />
              <div
                className="button"
                onClick={isUpdating ? () => updateTask(taskId) : createTask}
              >
                {isUpdating ? "Update Task" : "Create Task"}
              </div>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
