import "../pages/Form.css";
import { useFormik } from "formik";
import { loginFormSchema } from "../schemas/loginFormSchema";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (values, actions) => {
    const { email, password } = values;

    try {
      const { data } = await axios.post(
        "http://localhost:3001/auth/login",
        { email, password },
        { header: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.username);
      navigate("/");
    } catch (error) {
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
      password: "",
    },
    validationSchema: loginFormSchema,
    onSubmit,
  });

  return (
    <div className="formComponent">
      <div className="loginCard">
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
          <div className="forget-password__subtext">
            <span>
              <Link className="link" to="/forgot-password">
                Forgot Password?
              </Link>
            </span>
          </div>
          <button
            className="submit-button"
            disabled={isSubmitting}
            type="submit"
          >
            Submit
          </button>

          <span className="login-screen__subtext">
            Don't have an account?
            <Link className="link" to="/register">
              Register
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};
