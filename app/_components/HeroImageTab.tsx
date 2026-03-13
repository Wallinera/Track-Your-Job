"use client";

import Image from "next/image";
import { Button } from "./button";
import { useState } from "react";
import { useTheme } from "next-themes";

function HeroImageTab() {
  const [activeTab, setActiveTab] = useState("hero-1");
  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  return (
    <section className="border-t bg-white dark:bg-background py-16">
      <div className="container mx-auto px-4">
        <div className=" mx-auto max-w-6xl">
          {/*Tabs*/}

          <div className="flex gap-2 justify-center mb-8">
            <Button
              onClick={() => setActiveTab("hero-1")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "hero-1" ? "bg-primary text-white dark:bg-primary dark:text-black" : "bg-gray-100 text-gray-700 dark:bg-gray-300  hover:bg-gray-200"}`}
            >
              Organize Applications
            </Button>
            <Button
              onClick={() => setActiveTab("hero-2")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "hero-2" ? "bg-primary text-white dark:bg-primary dark:text-black" : "bg-gray-100 text-gray-700 dark:bg-gray-300  hover:bg-gray-200"}`}
            >
              Get Hired
            </Button>
            <Button
              onClick={() => setActiveTab("hero-3")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "hero-3" ? "bg-primary text-white dark:bg-primary dark:text-black" : "bg-gray-100 text-gray-700 dark:bg-gray-300  hover:bg-gray-200"}`}
            >
              Manage Boards
            </Button>
          </div>

          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl dark:border-border">
            {activeTab === "hero-1" ? (
              <Image
                src={
                  isDarkMode
                    ? "/hero-image/image-1-dark.PNG"
                    : "/hero-image/hero1.png"
                }
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            ) : activeTab === "hero-2" ? (
              <Image
                src={
                  isDarkMode
                    ? "/hero-image/image-2-dark.PNG"
                    : "/hero-image/hero2.png"
                }
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            ) : (
              <Image
                src={
                  isDarkMode
                    ? "/hero-image/image-3-dark.PNG"
                    : "/hero-image/hero3.png"
                }
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroImageTab;
