"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="minimal"
      size="icon"
      className="transition-colors duration-300 ease-in-out w-fit"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 " />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
