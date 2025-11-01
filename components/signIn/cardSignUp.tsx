"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { useCallback, useState } from "react";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";
import { Button } from "@heroui/button";
import { Eye, EyeOff } from "lucide-react";

import {
  handleApiResponse,
  isValidEmail,
  isValidPassword,
} from "@/utils/helper";
import { UserAPI } from "@/api/users/user";
import { SignUpRequest } from "@/types/user";
import { USER_ID_FOR_SIGN_UP } from "@/constants/signUp";

interface CardSignUpProps {
  onSignUpSuccess: () => void;
}

export const CardSignUp = ({ onSignUpSuccess }: CardSignUpProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
  const [fullNameErrorMsg, setFullNameErrorMsg] = useState("");

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    setConfirmPasswordErrorMsg("");
    setFullNameErrorMsg("");
  }, []);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailErrorMsg("");
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordErrorMsg("");
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPasswordErrorMsg("");
    setConfirmPassword(e.target.value);
  };
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullNameErrorMsg("");
    setFullName(e.target.value);
  };

  const validate = (): boolean => {
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    setConfirmPasswordErrorMsg("");
    setFullNameErrorMsg("");
    if (email.trim() === "") {
      setEmailErrorMsg("Email is required");

      return false;
    }

    if (!isValidEmail(email)) {
      setEmailErrorMsg("Invalid email address");

      return false;
    }

    if (password.trim() === "") {
      setPasswordErrorMsg("Password is required");

      return false;
    }

    if (!isValidPassword(password)) {
      setPasswordErrorMsg(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );

      return false;
    }

    if (confirmPassword.trim() === "") {
      setConfirmPasswordErrorMsg("Confirm password is required");

      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordErrorMsg("Passwords do not match");

      return false;
    }

    if (fullName.trim() === "") {
      setFullNameErrorMsg("Full name is required");

      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    const requestData: SignUpRequest = {
      email: email,
      password: password,
      name: fullName,
    };

    const { isError, error } = await UserAPI.signUp(
      USER_ID_FOR_SIGN_UP,
      requestData
    );

    if (isError) {
      handleApiResponse(
        error as AxiosError<{ message: string }>,
        "Failed to sign up"
      );
      setIsLoading(false);
      return;
    }

    addToast({
      title: "Success",
      description: "You are now signed up",
      color: "success",
    });
    setIsLoading(false);
    resetForm();
    onSignUpSuccess();
  };

  return (
    <Card className="w-full max-w-md p-4 shadow-none border border-default-200">
      <CardHeader>
        <div className="flex flex-col w-full items-start justify-start gap-2">
          <div className="text-xl font-bold">Create an account</div>
          <div className="text-xs text-default-500">
            Start managing your concerts today
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col w-full items-center justify-center gap-4">
          <Input
            className="w-full"
            errorMessage={emailErrorMsg}
            isInvalid={!!emailErrorMsg}
            label="Email"
            labelPlacement="outside-top"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <Input
            className="w-full"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={passwordErrorMsg}
            isInvalid={!!passwordErrorMsg}
            label="Password"
            labelPlacement="outside-top"
            placeholder="Enter password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
          />
          <Input
            className="w-full"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={confirmPasswordErrorMsg}
            isInvalid={!!confirmPasswordErrorMsg}
            label="Confirm Password"
            labelPlacement="outside-top"
            placeholder="Confirm password"
            type={isPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <Input
            className="w-full"
            errorMessage={fullNameErrorMsg}
            isInvalid={!!fullNameErrorMsg}
            label="Full Name"
            labelPlacement="outside-top"
            placeholder="Enter full name"
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
          />
        </div>
      </CardBody>
      <CardFooter>
        <Button
          className="w-full"
          color="primary"
          isLoading={isLoading}
          onPress={handleSignUp}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
};
