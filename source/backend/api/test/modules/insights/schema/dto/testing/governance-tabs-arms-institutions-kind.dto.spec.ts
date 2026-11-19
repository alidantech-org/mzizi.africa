import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTabsArmsInstitutionsKindDto } from "#/modules/insights/schema/dto/governance-tabs-arms-institutions-kind.dto.ts";
import { governanceTabsArmsInstitutionsKindExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-arms-institutions-kind.dto.example.ts";

/** Managed by Dryv: GovernanceTabsArmsInstitutionsKindDto enforces exactly what the GovernanceTabsArmsInstitutionsKind contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTabsArmsInstitutionsKindDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTabsArmsInstitutionsKindExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTabsArmsInstitutionsKindDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTabsArmsInstitutionsKindExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTabsArmsInstitutionsKindExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
