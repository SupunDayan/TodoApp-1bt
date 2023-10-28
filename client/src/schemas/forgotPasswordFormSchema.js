import * as yup from "yup";

export const forgotPasswordFormSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
});
