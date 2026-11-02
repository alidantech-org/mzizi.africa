import { describe, expect, it } from "vitest";

import { runAsActor } from "#/auth/actor-context";
import { identifierConstraints, isHiddenFromCaller, mayReadRestricted } from "#/read/restricted-identifiers";

const dataSource = { query: async () => [{ id: "scheme-pin" }, { id: "scheme-phone" }] } as never;

describe("restricted identifier schemes", () => {
  it("hide published phones, emails and tax numbers from the public", async () => {
    expect(mayReadRestricted()).toBe(false);
    expect(Object.keys(await identifierConstraints(dataSource))).toEqual(["schemeId"]);
    expect(await isHiddenFromCaller(dataSource, "scheme-pin")).toBe(true);
    expect(await isHiddenFromCaller(dataSource, "scheme-business-registration")).toBe(false);
  });

  it("hide them from a contributor too", async () => {
    await runAsActor({ actorId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", role: "contributor" }, async () => {
      expect(mayReadRestricted()).toBe(false);
      expect(await isHiddenFromCaller(dataSource, "scheme-phone")).toBe(true);
    });
  });

  it("show them to a reviewer", async () => {
    await runAsActor({ actorId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", role: "reviewer" }, async () => {
      expect(mayReadRestricted()).toBe(true);
      expect(await identifierConstraints(dataSource)).toEqual({});
      expect(await isHiddenFromCaller(dataSource, "scheme-pin")).toBe(false);
    });
  });
});
