import { supabase } from "@/lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  // 🔁 mapeo snake_case → camelCase
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.image_url,
    discountPercent: p.discount_percent,
    priceOld: p.price_old,
    priceNow: p.price_now,
    transferPrice: p.transfer_price,
    installments: {
      count: p.installments_count,
      amount: p.installments_amount,
    },
  }));
}
