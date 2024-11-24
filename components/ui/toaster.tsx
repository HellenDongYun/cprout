"use client";
import { useTheme } from "next-themes";
import { Toaster as Toasty } from "sonner";
export default function Toaster() {
  const { theme } = useTheme();
  if (typeof theme === "string") {
    return (
      <Toasty
        position="top-right"
        richColors={true}
        duration={3000}
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    );
  }
}
