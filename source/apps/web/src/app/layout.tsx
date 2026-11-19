/** Shared document layout, fonts and metadata. The script in <head> paints the saved look from cookies before first paint; <Shell> renders the rest on the server from the same cookies. */
import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Suspense } from "react";
import { Shell } from "#/components/shell";
import { PwaRegister } from "#/components/pwa";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz", "SOFT", "WONK"] });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

const themeScript = `try{var g=function(n){var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):""},h=document.documentElement,t=g("mzizi-theme").split("~"),m=t[0]==="d"?"dark":t[0]==="l"?"light":"system",p=t[1]||"savanna",b=t[2]||"savanna",d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);h.dataset.mode=d?"dark":"light";var c=location.pathname.split("/")[1];if(!/^(ke|za|ng|tz)$/.test(c))c=g("mzizi-place").split("~")[0];h.dataset.palette=p==="custom"?"flag":p==="flag"?(/^(ke|za|ng|tz)$/.test(c)?"flag":b):p;var a=g("mzizi-a11y").split("~");if(a[0]&&a[0]!=="standard")h.dataset.contrast=a[0];if(+a[1]>=80&&+a[1]<=200&&+a[1]!==100)h.style.fontSize=a[1]+"%";var f=a[2]||"";if(f.indexOf("l")>=0)h.dataset.links="underline";if(f.indexOf("m")>=0)h.dataset.motion="reduce";if(f.indexOf("s")>=0)h.dataset.spacing="wide"}catch(e){}`;

export const metadata: Metadata = {
  applicationName: "Mzizi",
  title: { default: "Mzizi", template: "%s · Mzizi" },
  description: "Evidence-based African knowledge, mapped through time and place.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Mzizi", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fcf9f2" }, { media: "(prefers-color-scheme: dark)", color: "#1d1914" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning data-palette="savanna" className={`${fraunces.variable} ${hanken.variable} ${plex.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased"><Suspense fallback={null}><Shell>{children}</Shell></Suspense><PwaRegister /></body>
    </html>
  );
}
