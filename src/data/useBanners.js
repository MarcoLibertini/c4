"use client";

import { useEffect, useState } from "react";
import { bannerDefaults } from "./bannerDefaults";

const KEY = "c4laser_banners_v1";

export default function useBanners() {
  const [banners, setBanners] = useState(bannerDefaults);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setBanners(parsed);
      } catch {
        setBanners(bannerDefaults);
      }
    }

    const onUpdate = () => {
      const raw2 = localStorage.getItem(KEY);
      if (!raw2) return setBanners(bannerDefaults);
      try {
        const parsed2 = JSON.parse(raw2);
        if (Array.isArray(parsed2)) setBanners(parsed2);
      } catch {
        setBanners(bannerDefaults);
      }
    };

    window.addEventListener("c4laser_banners_updated", onUpdate);
    return () =>
      window.removeEventListener("c4laser_banners_updated", onUpdate);
  }, []);

  const save = (next) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("c4laser_banners_updated"));
    setBanners(next);
  };

  return { banners, save };
}
