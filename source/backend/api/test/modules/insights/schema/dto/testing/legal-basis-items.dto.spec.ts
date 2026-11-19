import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalBasisItemsDto } from "#/modules/insights/schema/dto/legal-basis-items.dto.ts";
import { legalBasisItemsExample } from "@test/modules/insights/schema/dto/examples/legal-basis-items.dto.example.ts";

/** Managed by Dryv: LegalBasisItemsDto enforces exactly what the LegalBasisItems contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalBasisItemsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalBasisItemsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LegalBasisItemsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalBasisItemsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...legalBasisItemsExample.valid(),
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
