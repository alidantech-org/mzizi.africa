import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalBasisInputDto } from "#/modules/insights/schema/dto/legal-basis-input.dto.ts";
import { legalBasisInputExample } from "@test/modules/insights/schema/dto/examples/legal-basis-input.dto.example.ts";

/** Managed by Dryv: LegalBasisInputDto enforces exactly what the LegalBasisInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalBasisInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalBasisInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LegalBasisInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalBasisInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...legalBasisInputExample.valid(),
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
