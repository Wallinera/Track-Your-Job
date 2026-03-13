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
import { useAuth } from "../_hooks/useAuth";
import Link from "next/link";
import { SignInInputs } from "@/lib/models/models.types";

function Signin() {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { email: emailError, password: passwordError },
      isSubmitting,
    },
    reset,
  } = useForm<SignInInputs>();

  const { signInAction } = useAuth();

  const onSubmit: SubmitHandler<SignInInputs> = async (formData) => {
    await signInAction(formData);
    reset();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white dark:bg-background p-4">
      <Card className="w-full max-w-md border-gray-200 dark:border-border dark:bg-card shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black dark:text-white/80">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-muted-foreground">
            Log in to your account to start tracking your job applications
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            {(emailError || passwordError) && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {emailError ? emailError.message : passwordError?.message}
              </div>
            )}

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
                {...register("email", {
                  required: "Email field is required",
                })}
                className="border-gray-300 focus:border-primary focus:ring-primary dark:border-border dark:text-muted-foreground"
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
                {...register("password", {
                  required: "Password field is required",
                  minLength: {
                    value: 8,
                    message:
                      "Your password should contain at least 8 characters",
                  },
                })}
                className="border-gray-300 focus:border-primary focus:ring-primary dark:border-border dark:text-muted-foreground"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loggin in..." : "Log in"}
            </Button>
            <p className="text-center text-sm text-gray-600  dark:text-muted-foreground">
              Don`t have an account?
              <Link
                href="/sign-up"
                className="font-medium text-primary hover:underline"
              >
                {"  "}
                Sign up for free!
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Signin;
