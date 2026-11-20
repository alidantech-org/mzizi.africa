/** Independent root for the real backend-connected application. Demo setup must never be imported here. */
import "./real.css";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
const heading = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz", "SOFT", "WONK"] });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
export const metadata: Metadata = {
  title: "Mzizi",
  description: "Explore African places, knowledge and evidence in context.",
  icons: {
    icon: [
      { url: "/icons/favicon.ico", type: "image/x-icon" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-icon.png",
  },
};
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-ui="real" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
