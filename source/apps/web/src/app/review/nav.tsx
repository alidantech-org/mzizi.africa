'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/review', 'Review queue'],
  ['/review/runs', 'Runs'],
  ['/review/jobs', 'Jobs'],
  ['/review/sites', 'Sites'],
  ['/review/assessments', 'Assessments'],
  ['/review/documents', 'Documents'],
  ['/review/captures', 'Captures'],
  ['/review/structure', 'Structure'],
  ['/review/checks', 'Checks'],
  ['/review/data', 'Canonical data'],
] as const;

export function Nav() {
  const path = usePathname();
  return (
    <>
      {LINKS.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            path === href || (href !== '/review' && path.startsWith(href)) || (href === '/review' && path.startsWith('/review/candidates'))
              ? 'page'
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </>
  );
}
