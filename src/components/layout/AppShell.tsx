import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { appBg } from "../../styles/layout";

const THEME_KEY = "bank-app-theme";

function AppShell() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className={appBg}>
      <TopNav isDark={isDark} onThemeToggle={() => setIsDark((current) => !current)} />
      <Outlet />
    </div>
  );
}

export default AppShell;
