import { useFormik } from "formik";
import { registerFormSchema } from "../schemas/registerFormSchema";
import "../pages/Form.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, []);

  const onSubmit = async (values, actions) => {
    const { username, email, password } = values;

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "http://localhost:3001/auth/register",
        {
          username,
          email,
          password,
        },
        config
      );

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.user.username);
      navigate("/");
    } catch (error) {
      alert(error.response.data.error);
    }

    console.log(values);
    console.log(actions);
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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerFormSchema,
    onSubmit,
  });

  return (
    <div className="formComponent">
      <div className="registerCard">
        <h1> Register </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="username">Username</label>
          <input
            value={values.username}
            onChange={handleChange}
            id="username"
            type="text"
            placeholder="Enter your username"
            onBlur={handleBlur}
            className={errors.username && touched.username ? "input-error" : ""}
          />
          {errors.username && touched.username && (
            <p className="error">{errors.email}</p>
          )}

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

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.confirmPassword && touched.confirmPassword
                ? "input-error"
                : ""
            }
            autoComplete="on"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button
            className="submit-button"
            disabled={isSubmitting}
            type="submit"
          >
            Submit
          </button>

          <span className="register-screen__subtext">
            Already have an account?
            <Link to="/login" className="link">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};
