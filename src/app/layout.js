import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../store/cart";
import TabAttention from "@/components/TabAttention";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "C4 - Creaciones Láser",
  description:
    "Cortes y grabados láser. Llaveros, cartelería, etiquetas, díjes y personalizados. Pedí por WhatsApp.",
  metadataBase: new URL("https://TU-DOMINIO.com"), // luego lo cambiás
  openGraph: {
    title: "C4 - Creaciones Láser",
    description:
      "Cortes y grabados láser. Pedí por WhatsApp y coordinamos entrega.",
    type: "website",
  },
  icons: {icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.png", type: "image/png" }, // fallback opcional
  ],
  },
  openGraph: {
    title: "C4 - Creaciones Láser",
    description: "Cortes y grabados láser personalizados. Pedí por WhatsApp.",
    images: ["/og.png"],
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TabAttention />
        <WhatsAppFloat />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
