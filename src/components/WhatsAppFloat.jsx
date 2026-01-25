"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const phone = "5492916439736"; // WhatsApp usa código país +54 y 9
  const message = "Hola! Quiero hacer una consulta 🙂";

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-5 right-5 z-50
        flex items-center gap-2
        rounded-full bg-green-500
        px-4 py-3 text-white
        shadow-lg
        hover:bg-green-600
        transition
      "
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
