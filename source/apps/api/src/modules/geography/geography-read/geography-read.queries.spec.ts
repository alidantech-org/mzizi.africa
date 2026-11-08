import { describe, expect, it } from 'vitest';

import { toFeature } from '#/modules/geography/geography-read/geography-read.queries';

describe('toFeature', () => {
  const base = { id: 'u1', code: 'ke/nairobi', name: 'Nairobi', geometry: '{"type":"Polygon","coordinates":[[[36,-1],[37,-1],[37,-2],[36,-1]]]}', label_point: null };

  it('carries the source, reference, licence, year, retrieval time and version of the boundary', () => {
    const feature = toFeature({ ...base, publisher_name: 'geoBoundaries', source_name: 'KEN ADM1', source_url: 'https://example.org/k', source_reference: 'Runfola 2020', licence: 'Public Domain', reference_year: 2020, retrieved_at: new Date('2026-11-02T08:00:00Z'), version_number: 2 });
    expect(feature.properties).toMatchObject({
      geography_id: 'u1',
      boundary_verified: true,
      boundary_source: 'geoBoundaries: KEN ADM1',
      boundary_source_reference: 'https://example.org/k',
      boundary_license: 'Public Domain',
      boundary_year: '2020',
      boundary_retrieved_at: '2026-11-02T08:00:00.000Z',
      boundary_version: 2,
    });
  });

  it('uses null, never a guess, when a source detail is unknown', () => {
    expect(toFeature(base).properties).toMatchObject({ boundary_source: null, boundary_license: null, boundary_year: null, boundary_retrieved_at: null, boundary_version: null });
  });
});
