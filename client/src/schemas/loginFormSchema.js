import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const loginFormSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),

  password: yup
    .string()
    .min(5, "Invalid")
    .matches(passwordRules, { message: "Invalid" })
    .required("Required"),
});
