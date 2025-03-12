import React, { useState } from "react";
import { User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

interface AuthOptionsProps {
  defaultTab?: "login" | "register";
  defaultUserType?: "patient" | "doctor";
  onLogin?: (data: any) => void;
  onRegister?: (data: any) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

const AuthOptions = ({
  defaultTab = "login",
  defaultUserType = "patient",
  onLogin = () => {},
  onRegister = () => {},
  onForgotPassword = () => {},
  isLoading = false,
}: AuthOptionsProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [userType, setUserType] = useState<"patient" | "doctor">(
    defaultUserType,
  );

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-blue-50 pb-2">
        <CardTitle className="text-2xl font-bold text-center text-blue-800">
          Healthcare Assistant
        </CardTitle>
        <CardDescription className="text-center">
          Connect with doctors and manage your health
        </CardDescription>

        <div className="flex justify-center gap-4 mt-4">
          <Button
            type="button"
            variant={userType === "patient" ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setUserType("patient")}
          >
            <User size={18} />
            Patient
          </Button>
          <Button
            type="button"
            variant={userType === "doctor" ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setUserType("doctor")}
          >
            <Stethoscope size={18} />
            Doctor
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <LoginForm
              onSubmit={onLogin}
              onForgotPassword={onForgotPassword}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <RegistrationForm userType={userType} onSubmit={onRegister} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="bg-gray-50 flex justify-center p-4">
        <p className="text-sm text-gray-600">
          {activeTab === "login" ? (
            <>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => setActiveTab("register")}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => setActiveTab("login")}
              >
                Sign in
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthOptions;
