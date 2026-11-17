import { describe, expect, it } from "vitest";

import { ResolveLocalityUseCase } from "#/modules/locality/features/places/use-cases/resolve-locality.usecase";

/**
 * Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ResolveLocalityUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ResolveLocalityUseCase>;
    expect(new ResolveLocalityUseCase(...args)).toBeInstanceOf(ResolveLocalityUseCase);
  });

  it.todo(
    "Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.",
  );
});
