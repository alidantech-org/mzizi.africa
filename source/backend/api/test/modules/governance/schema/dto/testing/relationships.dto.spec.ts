import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RelationshipsDto } from "#/modules/governance/schema/dto/relationships.dto.ts";
import { relationshipsExample } from "@test/modules/governance/schema/dto/examples/relationships.dto.example.ts";

/** Managed by Dryv: RelationshipsDto enforces exactly what the Relationships contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RelationshipsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = relationshipsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RelationshipsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(relationshipsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...relationshipsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
