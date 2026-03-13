"use client";

import { signIn, signUp, signOut } from "@/lib/auth/auth-client";
import { SignInInputs, SignUpInputs } from "@/lib/models/models.types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useAuth() {
  let errorMessage = "";
  const router = useRouter();

  const signUpAction = async ({ name, email, password }: SignUpInputs) => {
    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        errorMessage = result.error.message!;
        throw new Error();
      }

      toast.success("Sign up successfull!");
      router.push("/dashboard");
    } catch {
      toast.error(errorMessage);
    }
  };

  const signInAction = async ({ email, password }: SignInInputs) => {
    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        errorMessage = result.error.message!;
        throw new Error();
      }

      toast.success("Sign In successfull!");
      router.push("/dashboard");
    } catch {
      toast.error(errorMessage);
    }
  };

  const signOutAction = async () => {
    try {
      const result = await signOut();

      if (result.error) {
        errorMessage = result.error.message!;
        throw new Error();
      }
      toast.success("Sucessfully signed out!");
      router.replace("/sign-in");
    } catch {
      toast.error(errorMessage);
    }
  };

  return { signUpAction, signInAction, signOutAction, errorMessage };
}
