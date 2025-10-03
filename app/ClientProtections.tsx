"use client";

import { useEffect } from "react";

export default function ClientProtections() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Block common DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || // F12
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) || // Ctrl+Shift+I/C/J
        (e.ctrlKey && e.key.toLowerCase() === "u") // Ctrl+U
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null; // nothing to render, just side effects
}
