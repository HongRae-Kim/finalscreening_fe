"use client";

import { Moon, Sun } from "lucide-react";
import CircleBtn from "../button/CircleBtn";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggleBtn() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <CircleBtn
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hover:bg-bg-quaternary"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </CircleBtn>
  );
}
