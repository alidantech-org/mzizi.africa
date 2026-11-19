import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailContentClassificationDto } from "#/modules/insights/schema/dto/institution-detail-content-classification.dto.ts";
import { institutionDetailContentClassificationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-classification.dto.example.ts";

/** Managed by Dryv: InstitutionDetailContentClassificationDto enforces exactly what the InstitutionDetailContentClassification contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailContentClassificationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailContentClassificationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailContentClassificationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailContentClassificationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailContentClassificationExample.valid(),
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
