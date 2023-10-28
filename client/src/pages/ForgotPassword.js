import "../pages/Form.css";
import { useFormik } from "formik";
import { forgotPasswordFormSchema } from "../schemas/forgotPasswordFormSchema";
import axios from "axios";

export const ForgotPassword = () => {
  const onSubmit = async (values, actions) => {
    const { email } = values;

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
    },
    validationSchema: forgotPasswordFormSchema,
    onSubmit,
  });

  return (
    <div className="formComponent">
      <div className="forgetPasswordCard">
        <h1> Forgot Password </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <p className="forgotpassword-screen__subtext">
            Please enter your registered email address.
          </p>
          <p className="forgotpassword-screen__subtext">
            We will send you a link to reset your password to your registered
            email address.
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

          <button
            className="submit-button"
            disabled={isSubmitting}
            type="submit"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
};
