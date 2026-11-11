import { describe, expect, it, vi } from 'vitest';

import { SearchOfficeHoldersUseCase, likeWords } from '#/modules/governance/governance-read/use-cases/search-office-holders.usecase';

function build(rows: unknown[] = [], total = 0) {
  const query = vi.fn(async (sql: string) => (sql.includes('count(*)') ? [{ total }] : rows));
  return { useCase: new SearchOfficeHoldersUseCase({ query } as never), query };
}

describe('SearchOfficeHoldersUseCase', () => {
  it('escapes LIKE wildcards and spreads words', () => {
    expect(likeWords('100% mp_x')).toBe('%100\\%%mp\\_x%');
  });

  it('runs without filters, newest first, with a default page of 25', async () => {
    const { useCase, query } = build([{ holderId: 'h1' }], 1);
    const out = await useCase.execute({} as never);
    expect(out).toMatchObject({ total: 1, page: 1, limit: 25, results: [{ holderId: 'h1' }] });
    const sql = String(query.mock.calls[1]![0]);
    expect(sql).toContain('ORDER BY h.is_current DESC');
    expect(sql).not.toContain('$1');
  });

  it('binds every filter as a parameter, never into the SQL text', async () => {
    const { useCase, query } = build();
    await useCase.execute({ q: "Ruto'; DROP TABLE x;--", office: 'senator', institution: 'senate', county: 'Kisumu', party: 'odm', current: true, limit: 500, page: 2 } as never);
    const [sql, params] = query.mock.calls[1]! as unknown as [string, unknown[]];
    expect(sql).not.toContain('DROP TABLE');
    expect(sql).toContain('h.is_current');
    expect(sql).toContain('LIMIT 200 OFFSET 200');
    expect(params).toHaveLength(5);
    expect(params[0]).toContain('DROP');
  });

  it('matches a party by id when it is a UUID', async () => {
    const { useCase, query } = build();
    await useCase.execute({ party: '0f761ed1-3b83-4186-8b3b-46ca0233d121' } as never);
    expect(String(query.mock.calls[0]![0])).toContain('pa.id = $1');
  });

  it('accepts the string "true" for current', async () => {
    const { useCase, query } = build();
    await useCase.execute({ current: 'true' } as never);
    expect(String(query.mock.calls[0]![0])).toContain('h.is_current');
  });
});
