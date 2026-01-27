"use client";

import Image from "next/image";

export default function WhatsAppFloat() {
  const phone = "5492916439736";
  const text = "Hola! Quiero hacer una consulta.";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="
        fixed bottom-5 right-5 z-50
        h-14 w-14 rounded-full
        bg-[#25D366]
        flex items-center justify-center
        shadow-lg
        hover:scale-105 hover:shadow-xl
        transition
      "
    >
      <Image
        src="/c4-mark-white.svg"
        alt="C4"
        width={26}
        height={26}
        className="object-contain"
        priority
      />
    </a>
  );
}
