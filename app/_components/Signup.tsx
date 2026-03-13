"use client";

import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";

import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "../_hooks/useAuth";
import { SignUpInputs } from "@/lib/models/models.types";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { email: emailError, name: nameError, password: passwordError },
      isSubmitting,
    },
    reset,
  } = useForm<SignUpInputs>();

  const { signUpAction } = useAuth();

  const onSubmit: SubmitHandler<SignUpInputs> = async (formData) => {
    await signUpAction(formData);
    reset();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white dark:bg-background p-4">
      <Card className="w-full max-w-md border-gray-200 dark:border-border dark:bg-card shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black dark:text-white/80">
            Sign Up
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-muted-foreground">
            Create an account to start tracking your job applications
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            {(emailError || nameError || passwordError) && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {nameError
                  ? nameError.message
                  : emailError
                    ? emailError.message
                    : passwordError?.message}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-muted-foreground"
              >
                Name
              </Label>
              <Input
                disabled={isSubmitting}
                id="name"
                type="text"
                placeholder="John Doe"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
                {...register("name", {
                  required: "Name field is required",
                  maxLength: {
                    value: 50,
                    message: "Max characters can not be higher than 50",
                  },
                })}
                className="border-gray-300 focus:border-primary focus:ring-primary dark:text-muted-foreground dark:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-muted-foreground"
              >
                Email
              </Label>
              <Input
                disabled={isSubmitting}
                id="email"
                type="email"
                placeholder="you@example.com"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                {...register("email", {
                  required: "Email field is required",
                })}
                className="border-gray-300 focus:border-primary focus:ring-primary dark:ring-ring dark:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-muted-foreground"
              >
                Password
              </Label>
              <Input
                disabled={isSubmitting}
                id="password"
                type="password"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                {...register("password", {
                  required: "Password field is required",
                  minLength: {
                    value: 8,
                    message: "Password should contain at least 8 characters",
                  },
                })}
                className="border-gray-300 focus:border-primary focus:ring-primary dark:text-muted-foreground dark:ring-ring"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-muted-foreground">
              Already have an account?
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                {" "}
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
