import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RelationshipEntryNamesDto } from "#/modules/governance/schema/dto/relationship-entry-names.dto.ts";
import { relationshipEntryNamesExample } from "@test/modules/governance/schema/dto/examples/relationship-entry-names.dto.example.ts";

/** Managed by Dryv: RelationshipEntryNamesDto enforces exactly what the RelationshipEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RelationshipEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = relationshipEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RelationshipEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(relationshipEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...relationshipEntryNamesExample.valid(),
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
