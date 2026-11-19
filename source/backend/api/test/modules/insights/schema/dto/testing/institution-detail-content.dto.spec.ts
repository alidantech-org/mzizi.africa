import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailContentDto } from "#/modules/insights/schema/dto/institution-detail-content.dto.ts";
import { institutionDetailContentExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content.dto.example.ts";

/** Managed by Dryv: InstitutionDetailContentDto enforces exactly what the InstitutionDetailContent contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailContentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailContentExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailContentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailContentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailContentExample.valid(),
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
