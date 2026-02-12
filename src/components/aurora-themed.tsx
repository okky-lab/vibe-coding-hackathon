"use client";

import { useEffect, useState } from "react";

import Aurora from "@/components/Aurora";

const DARK_COLOR_STOPS = ["#2563eb", "#0891b2", "#16a34a"];
const LIGHT_COLOR_STOPS = ["#bfdbfe", "#99f6e4", "#bbf7d0"];

function isDarkTheme() {
  if (typeof document === "undefined") return true;
  return document.documentElement.classList.contains("dark");
}

export default function ThemedAurora() {
  const [isDark, setIsDark] = useState<boolean>(() => isDarkTheme());

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setIsDark(root.classList.contains("dark"));

    syncTheme();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          syncTheme();
          break;
        }
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const colorStops = isDark ? DARK_COLOR_STOPS : LIGHT_COLOR_STOPS;
  const amplitude = isDark ? 1.1 : 0.72;
  const blend = isDark ? 0.4 : 0.34;

  return <Aurora colorStops={colorStops} amplitude={amplitude} blend={blend} speed={1} />;
}
