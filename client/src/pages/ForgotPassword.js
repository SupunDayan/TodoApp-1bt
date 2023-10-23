import "../pages/ForgotPassword.css";
import { useFormik } from "formik";
import { forgotPasswordFormSchema } from "../schemas/forgotPasswordFormSchema";
// import { useState } from "react"
import axios from 'axios';


export const ForgotPassword = () => {

    // const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");

    const onSubmit = async (values, actions) => {

        const {email} = values;

        const config = {
            header: {
              "Content-Type": "application/json",
            },
          };
      
          try {
            const { data } = await axios.post(
              "http://localhost:3001/auth/forgot-password",
              { email },
              config
            );

            alert(data.data);
            // setSuccess(data.data);
          } catch (error) {
            // setError(error.response.data.error);
            // setEmail("");
            // setTimeout(() => {
            //   setError("");
            // }, 5000);
            alert(error.response.data.error);
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
        email: "",
        },
        validationSchema: forgotPasswordFormSchema,
        onSubmit,
    });


    return (
        <div className="forgotPassword">
        <h1> Forgot Password </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
            <p className="forgotpassword-screen__subtext">
                Please enter the email address you register your account with. We
                will send you reset password confirmation to this email
            </p>
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

            <button className="forgotPassword-button" disabled={isSubmitting} type="submit">
            Send Email
            </button>
            
        </form>
        </div>
    );
};

