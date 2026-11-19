import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailLeadersUnitDto } from "#/modules/insights/schema/dto/institution-detail-leaders-unit.dto.ts";
import { institutionDetailLeadersUnitExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders-unit.dto.example.ts";

/** Managed by Dryv: InstitutionDetailLeadersUnitDto enforces exactly what the InstitutionDetailLeadersUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailLeadersUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailLeadersUnitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailLeadersUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailLeadersUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailLeadersUnitExample.valid(),
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
