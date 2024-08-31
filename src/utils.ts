import Iseamil from "isemail";
import yup from "yup";

export const userCredentialsSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});
export const userDetailsSchema = yup
  .object({ name: yup.string().required(), desiredJobTitle: yup.string().required(), aboutMe: yup.string().required() })
  .concat(userCredentialsSchema);

export function verifyUserCredentials(email: unknown, password: unknown) {
  return isString(email) && isString(password) && Iseamil.validate(email) && password.length > 8
    ? { email, password }
    : null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
