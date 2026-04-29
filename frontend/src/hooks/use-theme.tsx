"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: (event?: React.MouseEvent) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function enableTransition(x: number, y: number) {
  if (!document.startViewTransition) {
    return;
  }

  const clipX = x;
  const clipY = y;
  const maxRadius = Math.ceil(
    Math.max(
      Math.hypot(clipX, window.innerHeight - clipY),
      Math.hypot(window.innerWidth - clipX, clipY)
    )
  );

  document.documentElement.style.setProperty(
    "--transition-x",
    `${clipX}px`
  );
  document.documentElement.style.setProperty(
    "--transition-y",
    `${clipY}px`
  );
  document.documentElement.style.setProperty(
    "--transition-size",
    `${maxRadius}px`
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return getInitialTheme() === "dark";
  });

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        enableTransition(x, y);
        setIsDark((prev) => !prev);
      });
    } else {
      enableTransition(x, y);
      setIsDark((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add(
      "transition-colors",
      "duration-300",
      "ease-in-out"
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}