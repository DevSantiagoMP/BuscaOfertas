export const validatePassword = (password: string): string => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

  if (!regex.test(password)) {
    return "La contraseña debe tener mayúsculas, minúsculas, un número y un carácter especial.";
  }

  return "";
};