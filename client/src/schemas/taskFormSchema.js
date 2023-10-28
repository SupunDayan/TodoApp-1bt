import * as yup from "yup";

export const taskFormSchema = yup.object().shape({
  task: yup.string().required("Required"),

  dueDateTime: yup.date().required("Required"),
});
