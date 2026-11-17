/** Home page at `/`. Scaffolded by Dryv once; this file belongs to the app. Lay it out however you like. */
import Link from "next/link";

import { navigation } from "#/lib/dryv/routes.ts";

export default function HomePage() {
  return (
    <main className="dryv-page">
      <h1>Mzizi Dev</h1>
      <ul>
        {navigation.map((entry) => (
          <li key={entry.name}>
            <Link href={entry.href}>{entry.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
