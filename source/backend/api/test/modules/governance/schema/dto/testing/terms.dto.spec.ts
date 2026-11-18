import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TermsDto } from "#/modules/governance/schema/dto/terms.dto.ts";
import { termsExample } from "@test/modules/governance/schema/dto/examples/terms.dto.example.ts";

/** Managed by Dryv: TermsDto enforces exactly what the Terms contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TermsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = termsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TermsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(termsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...termsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
