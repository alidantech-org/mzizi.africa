import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeTermsDto } from "#/modules/governance/schema/dto/office-terms.dto.ts";
import { officeTermsExample } from "@test/modules/governance/schema/dto/examples/office-terms.dto.example.ts";

/** Managed by Dryv: OfficeTermsDto enforces exactly what the OfficeTerms contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeTermsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeTermsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeTermsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeTermsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeTermsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
