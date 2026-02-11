// src/lib/landingServer.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { landingDefaults } from "@/data/landingDefaults";
import { unstable_cache } from "next/cache";

function mergeLanding(v) {
  return { ...landingDefaults, ...(v || {}) };
}

async function _getLanding() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "landing")
    .maybeSingle();

  if (error) {
    console.error("getLanding error:", error);
    return mergeLanding({});
  }

  return mergeLanding(data?.value || {});
}

// ✅ Cache con TAG. Revalidate grande (o false) porque lo invalidamos con revalidateTag().
export const getLanding = unstable_cache(_getLanding, ["landing-settings"], {
  revalidate: 3600, // 1h (podés dejar 60 si querés, igual va a ser instantáneo con tag)
  tags: ["landing"],
});
