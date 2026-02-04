import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Registro - Granero Los Paisas",
  description: "Registro de clientes para Granero Los Paisas",
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
