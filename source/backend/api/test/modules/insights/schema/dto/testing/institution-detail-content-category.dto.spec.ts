import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailContentCategoryDto } from "#/modules/insights/schema/dto/institution-detail-content-category.dto.ts";
import { institutionDetailContentCategoryExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-category.dto.example.ts";

/** Managed by Dryv: InstitutionDetailContentCategoryDto enforces exactly what the InstitutionDetailContentCategory contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailContentCategoryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailContentCategoryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailContentCategoryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailContentCategoryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailContentCategoryExample.valid(),
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
