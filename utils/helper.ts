import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

  return emailRegex.test(email.trim());
};

export const isValidPassword = (password: string): boolean => {
  if (!password || typeof password !== "string") {
    return false;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return passwordRegex.test(password.trim());
};

export const handleApiResponse = (
  response:
    | { error?: AxiosError<{ message: string }> }
    | AxiosError<{ message: string }>,
  defaultErrorMessage: string
): void => {
  if ("error" in response) {
    if (response.error) {
      const message =
        response.error.response?.data?.message ?? defaultErrorMessage;

      addToast({
        title: "Error",
        description: message,
        color: "danger",
      });
    }
  } else if (response instanceof AxiosError) {
    const message = response.response?.data?.message ?? defaultErrorMessage;

    addToast({
      title: "Error",
      description: message,
      color: "danger",
    });
  }
};
