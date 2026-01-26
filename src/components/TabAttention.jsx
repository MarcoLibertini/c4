"use client";

import { useEffect } from "react";

export default function TabAttention() {
  useEffect(() => {
    const originalTitle = document.title;

    const onBlur = () => {
      document.title = "¡C4 Te Espera!";
    };

    const onFocus = () => {
      document.title = originalTitle;
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
