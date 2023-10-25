import "../pages/Dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId";
import { useGetUserName } from "../hooks/useGetUserName";

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [task, setTask] = useState("");
  const [dueDateTime, setdueDateTime] = useState("");
  const [taskId, setTaskId] = useState("");
  const [sortedTasks, setSortedData] = useState([]);
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

  useEffect(() => {
    const getAllTasksByUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/task/getAll/${userId}`
        );
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
  }, [userId]);

  const sortTasksByDate = (tasks) => {
    return tasks.sort(
      (a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime)
    );
  };

  const sortHandler = () => {
    if (!isSorting) {
      setIsSorting(true);
      const sorted = sortTasksByDate(tasks);
      setSortedData(sorted);
      setIsSorting(false);
    }
  };

  const highlightTodayTasksHandler = () => {
    setHighlightTodayTasks(!highlightTodayTasks);
  };

  const addTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/task/create",
        { task: task, dueDateTime: dueDateTime, taskOwner: userId },
        { headers: { "Content-Type": "application/json" } }
      );
      setTasks([...tasks, response.data]);
      setIsUpdating(false);
      setPopupActive(false);
      setTask("");
      setdueDateTime("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    const response = await axios.delete(
      `http://localhost:3001/task/delete/${taskId}`
    );
    setTasks((tasks) => tasks.filter((task) => task._id !== response.data._id));
  };

  const updateTask = async (taskId) => {
    try {
      const response = await axios.put("http://localhost:3001/task/update", {
        taskId: taskId,
        task: task,
        dueDateTime: dueDateTime,
      });
      console.log(response);
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task._id === response.data._id) {
            task.task = response.data.task;
          }
          return task;
        })
      );

      setIsUpdating(false);
      setPopupActive(false);
      setTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateMode = (taskId, task) => {
    setIsUpdating(true);
    setPopupActive(true);
    setTask(task);
    setdueDateTime(dueDateTime);
    setTaskId(taskId);
  };

  const closePopup = () => {
    setIsUpdating(false);
    setPopupActive(false);
    setTask("");
    setdueDateTime("");
  };

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
        {isSorting
          ? sortedTasks.map((task) => (
              <div
                className={
                  highlightTodayTasks && task.isToday
                    ? "task-highlighted"
                    : "task"
                }
                key={task._id}
              >
                <div className="box">
                  <div id="task" className="text">
                    {task.task}
                  </div>
                  <div id="task" className="text">
                    {new Date(task.dueDateTime).toLocaleDateString()}
                  </div>
                  <div id="task" className="text">
                    {new Date(task.dueDateTime).toLocaleTimeString()}
                  </div>
                </div>
                <div className="controls">
                  <div
                    className="update-task"
                    onClick={() => updateMode(task._id, task.task)}
                  >
                    ../
                  </div>
                  <div
                    className="delete-task"
                    onClick={() => deleteTask(task._id)}
                  >
                    x
                  </div>
                </div>
              </div>
            ))
          : tasks.map((task) => (
              <div
                className={
                  highlightTodayTasks && task.isToday
                    ? "task-highlighted grid-container"
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
                    {new Date(task.dueDateTime).toLocaleDateString()}
                  </div>
                  <div id="task" className="text">
                    {new Date(task.dueDateTime).toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="controls  grid-item">
                  <div
                    className="update-task"
                    onClick={() => updateMode(task._id, task.task)}
                  >
                    ../
                  </div>
                  <div
                    className="delete-task"
                    onClick={() => deleteTask(task._id)}
                  >
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
              onChange={(event) => setdueDateTime(event.target.value)}
            />
            <div
              className="button"
              onClick={isUpdating ? () => updateTask(taskId) : addTask}
            >
              {isUpdating ? "Update Task" : "Create Task"}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
