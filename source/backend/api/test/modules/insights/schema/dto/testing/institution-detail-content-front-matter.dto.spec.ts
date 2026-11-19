import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailContentFrontMatterDto } from "#/modules/insights/schema/dto/institution-detail-content-front-matter.dto.ts";
import { institutionDetailContentFrontMatterExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-front-matter.dto.example.ts";

/** Managed by Dryv: InstitutionDetailContentFrontMatterDto enforces exactly what the InstitutionDetailContentFrontMatter contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailContentFrontMatterDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailContentFrontMatterExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailContentFrontMatterDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailContentFrontMatterExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailContentFrontMatterExample.valid(),
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
