import { describe, expect, it } from "vitest";

import { GetProjectUseCase } from "#/modules/insights/features/insights/use-cases/get-project.usecase";

/**
 * One project: where, who is responsible, the money, the procurement, pictures and evidence.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetProjectUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetProjectUseCase>;
    expect(new GetProjectUseCase(...args)).toBeInstanceOf(GetProjectUseCase);
  });

  it.todo(
    "One project: where, who is responsible, the money, the procurement, pictures and evidence.",
  );
});
