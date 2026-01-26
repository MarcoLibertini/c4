"use client";

import { useEffect, useState } from "react";
import { landingDefaults } from "./landingDefaults";

const KEY = "c4laser_landing_v1";

export default function useLanding() {
  const [landing, setLanding] = useState(landingDefaults);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setLanding({ ...landingDefaults, ...parsed });
      } catch {
        setLanding(landingDefaults);
      }
    } else {
      setLanding(landingDefaults);
    }

    const onUpdate = () => {
      const raw2 = localStorage.getItem(KEY);
      if (!raw2) return setLanding(landingDefaults);
      try {
        const parsed2 = JSON.parse(raw2);
        setLanding({ ...landingDefaults, ...parsed2 });
      } catch {
        setLanding(landingDefaults);
      }
    };

    window.addEventListener("c4laser_landing_updated", onUpdate);
    return () => window.removeEventListener("c4laser_landing_updated", onUpdate);
  }, []);

  const save = (nextLanding) => {
    localStorage.setItem(KEY, JSON.stringify(nextLanding));
    window.dispatchEvent(new Event("c4laser_landing_updated"));
    setLanding(nextLanding);
  };

  return { landing, save };
}
