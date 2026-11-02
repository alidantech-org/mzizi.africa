import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mzizi — an open record of pre-colonial Africa",
  description:
    "Explore evidence-backed records of pre-colonial African settlements, kingdoms, objects, practices, trade corridors and languages.",
  metadataBase: new URL("https://mzizi.africa"),
  openGraph: {
    title: "Mzizi — an open record of pre-colonial Africa",
    description:
      "Every claim carries its period, place, sources and confidence — with the evidence left in plain view.",
    url: "https://mzizi.africa",
    siteName: "Mzizi Africa",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
