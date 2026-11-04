import type { Metadata } from "next";
import "./globals.css";
import "@/styles/venues.css";
import "@/styles/admin.css";
import "@/styles/auth.css";
import "@/styles/sedes-admin.css";
import "@/styles/galeria-admin.css";
import "@/styles/habitaciones-admin.css";
import "@/styles/habitaciones-galeria.css";

export const metadata: Metadata = {
  title: "Hotel Los Faroles | Cobán y Antigua Guatemala",
  description: "Hotel Los Faroles: estancias, gastronomía y experiencias en Cobán y Antigua Guatemala.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
