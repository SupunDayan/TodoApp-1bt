import "../components/AddTask.css";
import { useFormik } from "formik";
import { taskFormSchema } from "../schemas/taskFormSchema";
// import { useState } from "react";
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useGetUserId } from "../hooks/useGetUserId";


export const AddTask = () => {

    // const [error, setError] = useState("");
    const navigate = useNavigate();
    const userId = useGetUserId();

    // useEffect(() => {
    //     if (localStorage.getItem("authToken")) {
    //     navigate("/");
    //     }
    // }, []);

    const onSubmit = async (values, actions) => {

        const {task, dueDateTime} = values;
        const taskOwner = userId;

        console.log(dueDateTime);

        const config = {
            header: {
            "Content-Type": "application/json",
            },
        };
    
        try {
            const { data } = await axios.post(
            "http://localhost:3001/task/create",
            { task, dueDateTime, taskOwner },
            config
            );

            alert("Task Added Successfully!");
            navigate("/");
        } catch (error) {
            // setError(error.response.data.error);
            // setTimeout(() => {
            //   setError("");
            // }, 5000);
            console.log(error);
            alert(error);
        }

    actions.resetForm();
};

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleBlur,
        handleChange,
        handleSubmit,
    } = useFormik({
        initialValues: {
        task: "",
        dueDateTime: "",
        },
        validationSchema: taskFormSchema,
        onSubmit,
    });


    return (
        <div className="addTask">
        <h1> Add Task </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="task">Task</label>
            <input
            value={values.task}
            onChange={handleChange}
            id="task"
            type="text"
            placeholder="Enter a Task"
            onBlur={handleBlur}
            className={errors.task && touched.task ? "input-error" : ""}
            />
            {errors.task && touched.task && (
            <p className="error">{errors.task}</p>
            )}

            <label htmlFor="dueDateTime">Due Date and Time</label>
            <input
            id="dueDateTime"
            type="datetime-local"
            placeholder="Enter your password"
            value={values.dueDateTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.dueDateTime && touched.dueDateTime ? "input-error" : ""}
            />
            {errors.dueDateTime && touched.dueDateTime && (
            <p className="error">{errors.dueDateTime}</p>
            )}

            <button className="addTask-button" disabled={isSubmitting} type="submit">
            Add
            </button>

             
        </form>
        </div>
    );
};
