"use client";

import { Briefcase, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback } from "./avatar";
import { useSession } from "@/lib/auth/auth-client";
import { useAuth } from "../_hooks/useAuth";
import { useTheme } from "next-themes";

function Navbar() {
  const { theme, setTheme } = useTheme();

  const { data } = useSession();
  const user = data?.user || "";
  const { signOutAction } = useAuth();

  return (
    <nav className="border-b border-gray-200 dark:border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-xl font-semibold text-primary "
        >
          <Briefcase />
          Track Your Job
        </Link>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant={"outline"}
            className="cursor-pointer "
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
          {user ? (
            <>
              <Link href={"/dashboard"}>
                <Button
                  className="cursor-pointer text-gray-700 hover:text-black dark:text-white/70 dark:hover:text-muted-foreground"
                  variant={"ghost"}
                >
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="relative rounded-full h-8 w-8 cursor-pointer">
                    <Avatar className="h-8 w-8 ring-2 ring-ring dark:ring-ring">
                      <AvatarFallback className="bg-primary text-white">
                        {user.name.at(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={async () => await signOutAction()}
                    className="cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href={"/sign-in"}
                className="text-gray-700 hover:text-black duration-150"
              >
                <Button
                  className="cursor-pointer dark:text-white/80"
                  variant={"ghost"}
                >
                  {" "}
                  Log in
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button className="bg-primary hover:text-primary-80 duration-150 cursor-pointer">
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
