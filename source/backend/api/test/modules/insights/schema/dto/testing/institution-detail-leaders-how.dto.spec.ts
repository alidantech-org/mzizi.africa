import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailLeadersHowDto } from "#/modules/insights/schema/dto/institution-detail-leaders-how.dto.ts";
import { institutionDetailLeadersHowExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders-how.dto.example.ts";

/** Managed by Dryv: InstitutionDetailLeadersHowDto enforces exactly what the InstitutionDetailLeadersHow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailLeadersHowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailLeadersHowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailLeadersHowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailLeadersHowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailLeadersHowExample.valid(),
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
