import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailLeadersDto } from "#/modules/insights/schema/dto/institution-detail-leaders.dto.ts";
import { institutionDetailLeadersExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders.dto.example.ts";

/** Managed by Dryv: InstitutionDetailLeadersDto enforces exactly what the InstitutionDetailLeaders contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailLeadersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailLeadersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailLeadersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailLeadersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailLeadersExample.valid(),
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
