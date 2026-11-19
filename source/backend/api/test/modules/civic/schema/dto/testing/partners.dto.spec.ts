import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartnersDto } from "#/modules/civic/schema/dto/partners.dto.ts";
import { partnersExample } from "@test/modules/civic/schema/dto/examples/partners.dto.example.ts";

/** Managed by Dryv: PartnersDto enforces exactly what the Partners contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartnersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partnersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartnersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partnersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partnersExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
