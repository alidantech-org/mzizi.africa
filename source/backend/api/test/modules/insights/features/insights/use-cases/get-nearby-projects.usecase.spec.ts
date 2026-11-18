import { describe, expect, it } from "vitest";

import { GetNearbyProjectsUseCase } from "#/modules/insights/features/insights/use-cases/get-nearby-projects.usecase";

/**
 * Projects close to a position, nearest first, with status, who built them and the money, so a visitor sees what affects them.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetNearbyProjectsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetNearbyProjectsUseCase>;
    expect(new GetNearbyProjectsUseCase(...args)).toBeInstanceOf(GetNearbyProjectsUseCase);
  });

  it.todo(
    "Projects close to a position, nearest first, with status, who built them and the money, so a visitor sees what affects them.",
  );
});
