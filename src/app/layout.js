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
  description: "Cortes y grabados láser personalizados",
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
