import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PyroGuard AI | Autonomous Multi-Agent Fire Compliance & Asset Servicing Engine",
  description: "Dual Statutory Scope: South African SANS 10400-T / SANS 1475 and New Zealand NZS 4503 / FENZ Standards. Client-side cryptographic audit manifests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
