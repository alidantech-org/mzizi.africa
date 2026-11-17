/** Root layout. Scaffolded by Dryv once; this file belongs to the app. */
import type { ReactNode } from "react";

import "#/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
