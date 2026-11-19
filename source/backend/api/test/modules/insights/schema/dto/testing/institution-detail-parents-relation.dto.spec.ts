import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailParentsRelationDto } from "#/modules/insights/schema/dto/institution-detail-parents-relation.dto.ts";
import { institutionDetailParentsRelationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-parents-relation.dto.example.ts";

/** Managed by Dryv: InstitutionDetailParentsRelationDto enforces exactly what the InstitutionDetailParentsRelation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailParentsRelationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailParentsRelationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailParentsRelationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailParentsRelationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailParentsRelationExample.valid(),
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
