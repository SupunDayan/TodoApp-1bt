import "../pages/ResetPassword.css";
import { useFormik } from "formik";
import { resetPasswordFormSchema } from "../schemas/resetPasswordFormSchema";
// import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react"
import axios from 'axios';


export const ResetPassword = () => {

    // const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const { resetToken } = useParams();

    const onSubmit = async (values, actions) => {

        const {password} = values;

        const config = {
            header: {
              "Content-Type": "application/json",
            },
        };
      
      
        try {
            const { data } = await axios.put(
              `http://localhost:3001/auth/reset-password/${resetToken}`,
              {
                password,
              },
              config
            );
      
            // console.log(data);
            // setSuccess(data.data);
            alert(data.data);
            navigate("/login");
        } catch (error) {
            // setError(error.response.data.error);
            // setTimeout(() => {
            //   setError("");
            // }, 5000);
            alert(error.response.data.error);
          }
          actions.resetForm();
        }

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
            password: "",
            confirmPassword: "",
        },
        validationSchema: resetPasswordFormSchema,
        onSubmit,
    });


    return (
        <div className="resetPassword">
        <h1> Reset Password </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
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


        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
            errors.confirmPassword && touched.confirmPassword ? "input-error" : ""
            }
            autoComplete="on"
        />
        {errors.confirmPassword && touched.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
        )}
            <button className="resetPassword-button" disabled={isSubmitting} type="submit">
            Reset Password
            </button>
            
        </form>
        </div>
    );
};

