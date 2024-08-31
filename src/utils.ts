import Iseamil from "isemail";

export function verifyUserCredentials(email: unknown, password: unknown) {
  return isString(email) && isString(password) && Iseamil.validate(email) && password.length > 8
    ? { email, password }
    : null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
