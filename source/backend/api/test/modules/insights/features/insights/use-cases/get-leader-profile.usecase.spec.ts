import { describe, expect, it } from "vitest";

import { GetLeaderProfileUseCase } from "#/modules/insights/features/insights/use-cases/get-leader-profile.usecase";

/**
 * A leader: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetLeaderProfileUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLeaderProfileUseCase>;
    expect(new GetLeaderProfileUseCase(...args)).toBeInstanceOf(GetLeaderProfileUseCase);
  });

  it.todo(
    "A leader: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.",
  );
});
