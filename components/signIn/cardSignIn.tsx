"use client";

import { signIn, getSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/utils/helper";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

export const CardSignIn = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordInValid, setPasswordInvalid] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const router = useRouter();

  const validate = (): boolean => {
    setIsLoaded(false);
    setEmailInvalid(false);
    setPasswordInvalid(false);
    if (email.trim() === "") {
      setEmailInvalid(true);
      setEmailErrorMsg("Email is required");

      return false;
    }

    if (!isValidEmail(email)) {
      setEmailInvalid(true);
      setEmailErrorMsg("Invalid email address");

      return false;
    }

    if (password.trim() === "") {
      setPasswordInvalid(true);
      setPasswordErrorMsg("Password is required");

      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validate()) {
      setIsLoaded(false);

      return;
    }

    const requestData = {
      email: email,
      password: password,
    };

    setIsLoaded(true);
    const res = await signIn("credentials", {
      ...requestData,
      redirect: false,
    });

    if (!res?.error || res?.error === "SessionRequired") {
      addToast({
        title: "Login successful",
        description: "You are now logged in",
        color: "success",
      });
      const session = await getSession();

      if (session?.user?.isAdmin === true) {
        router.push("/admin");
      } else {
        router.push("/main");
      }
    } else {
      addToast({
        title: "Login failed",
        description: "Please check your credentials",
        color: "danger",
      });
      setIsLoaded(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInvalid(false);
    setEmailErrorMsg("");
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInvalid(false);
    setPasswordErrorMsg("");
    setPassword(e.target.value);
  };

  return (
    <Card className="w-full max-w-md p-4 shadow-none border border-default-200">
      <CardHeader>
        <div className="flex flex-col w-full items-start justify-start gap-2">
          <div className="text-xl font-bold">Welcome</div>
          <div className="text-xs text-default-500">
            Enter your credentials to access your dashboard
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col w-full items-center justify-center gap-4">
          <Input
            className="w-full"
            errorMessage={emailErrorMsg}
            id="login-email"
            isInvalid={emailInvalid}
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
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={passwordErrorMsg}
            isInvalid={passwordInValid}
            label="Password"
            labelPlacement="outside-top"
            placeholder="Enter password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            className="w-full bg-primary text-white"
            disabled={isLoaded}
            isLoading={isLoaded}
            onPress={handleLogin}
          >
            {isLoaded ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
