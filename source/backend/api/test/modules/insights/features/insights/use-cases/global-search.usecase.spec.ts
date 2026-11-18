import { describe, expect, it } from "vitest";

import { GlobalSearchUseCase } from "#/modules/insights/features/insights/use-cases/global-search.usecase";

/**
 * One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GlobalSearchUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GlobalSearchUseCase>;
    expect(new GlobalSearchUseCase(...args)).toBeInstanceOf(GlobalSearchUseCase);
  });

  it.todo(
    "One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is.",
  );
});
