"use client";

import { useEffect, useState } from "react";

import { cx } from "@/lib/cx";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeActive =
      document.documentElement.classList.contains("dark") ||
      document.documentElement.dataset.theme === "dark";

    setIsDark(darkModeActive);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextValue = !isDark;
    setIsDark(nextValue);
    document.documentElement.classList.toggle("dark", nextValue);
    document.documentElement.dataset.theme = nextValue ? "dark" : "light";
    window.localStorage.setItem("display-pro-theme", nextValue ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cx(
        "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition duration-300",
        "border-slate-200/80 bg-white/70 text-slate-700 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700",
        "dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-teal-500 dark:hover:text-teal-300"
      )}
      aria-label="Toggle dark mode"
    >
      {mounted ? (isDark ? "Dark mode" : "Light mode") : "Theme"}
    </button>
  );
}

