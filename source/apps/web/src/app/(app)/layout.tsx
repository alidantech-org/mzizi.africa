/** Shared document layout, fonts and metadata. The script in <head> paints the saved look from cookies before first paint; <Shell> renders the rest on the server from the same cookies. */
import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { ShellSkeleton } from "#/components/layout/shell-skeleton";
import { Shell } from "#/components/layout/shell";
import "./real.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz", "SOFT", "WONK"] });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

const themeScript = `try{var g=function(n){var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):""},h=document.documentElement,t=g("mzizi-app-theme").split("~"),m=t[0]==="d"?"dark":t[0]==="l"?"light":"system",p=t[1]||"savanna",b=t[2]||"savanna",d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);h.dataset.mode=d?"dark":"light";var ql=new URLSearchParams(location.search).get("lang")||g("mzizi-app-lang");if(/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(ql))h.lang=ql;var c=location.pathname.split("/")[1];if(!/^(ke|za|ng|tz)$/.test(c))c=g("mzizi-app-place").split("~")[0];h.dataset.palette=p==="custom"?"flag":p==="flag"?(/^(ke|za|ng|tz)$/.test(c)?"flag":b):p;var sd=g("mzizi-app-side").split("~");if(+sd[1]>=200&&+sd[1]<=380)h.style.setProperty("--side-w",sd[1]+"px");h.dataset.side=sd[0]==="r"?"rail":sd[0]==="h"?"hidden":"expanded";var a=g("mzizi-app-a11y").split("~");if(a[0]&&a[0]!=="standard")h.dataset.contrast=a[0];if(+a[1]>=80&&+a[1]<=200&&+a[1]!==100)h.style.fontSize=a[1]+"%";var f=a[2]||"";if(f.indexOf("l")>=0)h.dataset.links="underline";if(f.indexOf("m")>=0)h.dataset.motion="reduce";if(f.indexOf("s")>=0)h.dataset.spacing="wide";var lk=g("mzizi-app-look").split("~"),kk=["density","radius","border","card","grade","mstroke","mheight","mlabels"];for(var i=0;i<kk.length;i++)if(/^[a-z]+$/.test(lk[i]||""))h.dataset[kk[i]]=lk[i]}catch(e){}`;

export const metadata: Metadata = {
  applicationName: "Mzizi",
  title: { default: "Mzizi", template: "%s · Mzizi" },
  description: "Evidence-based African knowledge, mapped through time and place.",
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: "Mzizi", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf9f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1914" },
  ],
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html
      data-ui="real"
      lang="en"
      translate="no"
      suppressHydrationWarning
      data-palette="savanna"
      className={`${fraunces.variable} ${hanken.variable} ${plex.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <Suspense fallback={<ShellSkeleton />}>
          <Shell>{children}</Shell>
        </Suspense>
      </body>
    </html>
  );
}
