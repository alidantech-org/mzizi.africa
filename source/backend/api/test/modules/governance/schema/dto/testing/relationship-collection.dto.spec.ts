import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RelationshipCollectionDto } from "#/modules/governance/schema/dto/relationship-collection.dto.ts";
import { relationshipCollectionExample } from "@test/modules/governance/schema/dto/examples/relationship-collection.dto.example.ts";

/** Managed by Dryv: RelationshipCollectionDto enforces exactly what the RelationshipCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RelationshipCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = relationshipCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RelationshipCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(relationshipCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...relationshipCollectionExample.valid(),
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
