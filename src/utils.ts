import yup from "yup";

export const userCredentialsSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});
export const userDetailsSchema = yup
  .object({ name: yup.string().required(), desiredJobTitle: yup.string().required(), aboutMe: yup.string().required() })
  .concat(userCredentialsSchema);
