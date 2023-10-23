import "../pages/Login.css";
import { useFormik } from "formik";
import { loginFormSchema } from "../schemas/loginFormSchema";
// import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';


export const Login = () => {

    // const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
        navigate("/");
        }
    }, []);

    const onSubmit = async (values, actions) => {

        const {email, password} = values;

        const config = {
            header: {
            "Content-Type": "application/json",
            },
        };
    
        try {
            const { data } = await axios.post(
            "http://localhost:3001/auth/login",
            { email, password },
            config
            );
    
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userId", data.userId);
            navigate("/");
        } catch (error) {
            // setError(error.response.data.error);
            // setTimeout(() => {
            //   setError("");
            // }, 5000);

            alert(error.response.data.error);
        }
    console.log("Submitted");
    console.log(values);
    console.log(actions);
    console.log(email);
    console.log(password);

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
        email: "",
        password: "",
        },
        validationSchema: loginFormSchema,
        onSubmit,
    });


    return (
        <div className="login">
        <h1> Login </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="email">Email</label>
            <input
            value={values.email}
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="Enter your email"
            onBlur={handleBlur}
            className={errors.email && touched.email ? "input-error" : ""}
            />
            {errors.email && touched.email && (
            <p className="error">{errors.email}</p>
            )}

            <label htmlFor="password">Password</label>
            <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password && touched.password ? "input-error" : ""}
            autoComplete="on"
            />
            {errors.password && touched.password && (
            <p className="error">{errors.password}</p>
            )}

            <button className="register-button" disabled={isSubmitting} type="submit">
            Submit
            </button>

            <span className="login-screen__subtext">
            Don't have an account? <Link to="/register">Register</Link>
            </span>

            <span className="login-screen__subtext">
            <Link to="/forgot-password">Forgot Password?</Link>
            </span>

            
        </form>
        </div>
    );
};
