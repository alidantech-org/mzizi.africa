import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailDto } from "#/modules/insights/schema/dto/institution-detail.dto.ts";
import { institutionDetailExample } from "@test/modules/insights/schema/dto/examples/institution-detail.dto.example.ts";

/** Managed by Dryv: InstitutionDetailDto enforces exactly what the InstitutionDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailExample.valid(),
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
