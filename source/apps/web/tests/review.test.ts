import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { DATA_CATALOG } from '../src/lib/review/data-catalog';
import { ago, Badge, Pager } from '../src/app/review/ui';

const controllers = join(import.meta.dir, '../../api/src/modules');

function listRoutes(): Set<string> {
  const found = new Set<string>();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (name.endsWith('.controller.ts')) for (const m of readFileSync(path, 'utf8').matchAll(/@Get\("\/v1\/([a-z-]+)\/([a-z-]+)"\)/g)) if (m[1] !== 'pipeline') found.add(`${m[1]}/${m[2]}`);
    }
  };
  walk(controllers);
  return found;
}

describe('canonical data catalog', () => {
  test('matches the API list routes exactly (regenerate with bun scripts/data-catalog.ts)', () => {
    const catalogued = new Set(Object.entries(DATA_CATALOG).flatMap(([group, names]) => names.map((n) => `${group}/${n}`)));
    expect([...catalogued].sort()).toEqual([...listRoutes()].sort());
  });

  test('never exposes the reviewer pipeline routes as canonical data', () => {
    expect(Object.keys(DATA_CATALOG)).not.toContain('pipeline');
  });
});

describe('review components', () => {
  test('a badge shows the status without underscores', () => {
    expect(renderToStaticMarkup(createElement(Badge, { value: 'approved_with_conditions' }))).toContain('approved with conditions');
  });

  test('the pager links only to pages that exist', () => {
    const first = renderToStaticMarkup(createElement(Pager, { meta: { page: 1, limit: 50, total: 120, totalPages: 3 }, path: '/review/sites' }));
    expect(first).toContain('page=2');
    expect(first).not.toContain('Previous');
    const last = renderToStaticMarkup(createElement(Pager, { meta: { page: 3, limit: 50, total: 120, totalPages: 3 }, path: '/review/sites' }));
    expect(last).toContain('page=2');
    expect(last).not.toContain('Next');
  });

  test('a missing time renders as an empty string', () => {
    expect(ago(null)).toBe('');
  });
});
