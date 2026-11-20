import { describe, expect, it } from "vitest";

import { GetCopyBundleUseCase } from "#/modules/explorer/features/explorer/use-cases/get-copy-bundle.usecase";

/**
 * Every recorded wording for one language, optionally one area and country wording, with a content hash for long-lived caching. Words are never taken from another language.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCopyBundleUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCopyBundleUseCase>;
    expect(new GetCopyBundleUseCase(...args)).toBeInstanceOf(GetCopyBundleUseCase);
  });

  it.todo(
    "Every recorded wording for one language, optionally one area and country wording, with a content hash for long-lived caching. Words are never taken from another language.",
  );
});
