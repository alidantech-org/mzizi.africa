import { describe, expect, it } from "vitest";

import { ListManifestosUseCase } from "#/modules/ledger/features/ledger/use-cases/list-manifestos.usecase";

/**
 * Party and candidate manifestos by election.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListManifestosUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListManifestosUseCase>;
    expect(new ListManifestosUseCase(...args)).toBeInstanceOf(ListManifestosUseCase);
  });

  it.todo("Party and candidate manifestos by election.");
});
