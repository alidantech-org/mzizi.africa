import { describe, expect, it } from 'vitest';

import { assertTarget } from '#/modules/audit/audit/target';

const dbWith = (rows: unknown[]) => ({ query: async () => rows }) as never;

describe('assertTarget', () => {
  it('accepts a staging candidate that exists, so candidates can be reviewed before promotion', async () => {
    await expect(assertTarget(dbWith([{ '?column?': 1 }]), 'staging.candidates', '11111111-1111-4111-8111-111111111111')).resolves.toBeUndefined();
  });

  it('rejects a staging candidate that does not exist', async () => {
    await expect(assertTarget(dbWith([]), 'staging.candidates', '11111111-1111-4111-8111-111111111111')).rejects.toThrow(/not found/);
  });

  it('still rejects kinds that are neither contract entities nor allowed extras', async () => {
    await expect(assertTarget(dbWith([{}]), 'engine.jobs', '11111111-1111-4111-8111-111111111111')).rejects.toThrow(/unknown targetKind/);
    await expect(assertTarget(dbWith([{}]), 'staging.promotions', '11111111-1111-4111-8111-111111111111')).rejects.toThrow(/unknown targetKind/);
  });
});
