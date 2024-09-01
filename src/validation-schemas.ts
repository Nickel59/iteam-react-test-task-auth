import yup from "yup";

export const userCredentialsSchema = yup.object({
  email: yup.string().trim().required("Required").email("Not a valid email"),
  password: yup.string().trim().required("Required").min(8, "At least 8 characters"),
});
export const userDetailsSchema = yup
  .object({
    name: yup.string().trim().required("Required"),
    desiredJobTitle: yup.string().trim().required("Required"),
    aboutMe: yup.string().trim().required("Required"),
  })
  .concat(userCredentialsSchema);
