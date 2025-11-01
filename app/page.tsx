"use client";

import { Music2 } from "lucide-react";

import { ToastProvider } from "@heroui/toast";

import { CardSignIn } from "@/components/signIn/cardSignIn";
import { CardSignUp } from "@/components/signIn/cardSignUp";
import { Tab } from "@heroui/tabs";
import { Tabs } from "@heroui/tabs";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");

  const handleSignUpSuccess = () => {
    setActiveTab("signIn");
  };
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ToastProvider placement="top-right" toastProps={{ timeout: 3000 }} />
      <div className="flex items-center justify-center gap-2 mb-8">
        <Music2 className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Concert Manager</h1>
      </div>
      <div className="w-full max-w-md">
        <Tabs
          aria-label="Options"
          color="primary"
          fullWidth
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as "signIn" | "signUp")}
        >
          <Tab key="signIn" title="Sign In" value="signIn">
            <CardSignIn />
          </Tab>
          <Tab key="signUp" title="Sign Up" value="signUp">
            <CardSignUp onSignUpSuccess={handleSignUpSuccess} />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}
