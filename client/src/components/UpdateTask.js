// import "../components/UpdateTask.css";
import { useFormik } from "formik";
import { taskFormSchema } from "../schemas/taskFormSchema";
// import { useState } from "react";
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
// import { useGetUserId } from "../hooks/useGetUserId";
import { useGetTaskId } from "../hooks/useGetTaskId";


export const UpdateTask = ({taskId}) => {

    localStorage.setItem("taskId",taskId);

    // const [error, setError] = useState("");
    const navigate = useNavigate();
    // const userId = useGetUserId();
    const gotTaskId = useGetTaskId();

    // useEffect(() => {
    //     if (localStorage.getItem("authToken")) {
    //     navigate("/");
    //     }
    // }, []);

    const onSubmit = async (values, actions) => {

        const {task, dueDateTime} = values;
        const taskId = gotTaskId;

        console.log(dueDateTime);

        const config = {
            header: {
            "Content-Type": "application/json",
            },
        };
    
        try {
            const { data } = await axios.put(
            "http://localhost:3001/task/update",
            { taskId, task, dueDateTime },
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
        <div className="updateTask">
        <h1> Update Task </h1>
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

            <button className="updateTask-button" disabled={isSubmitting} type="submit">
            Add
            </button>

             
        </form>

    
        </div>

        
        
    );
};

<UpdateTask/>