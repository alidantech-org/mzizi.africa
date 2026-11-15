import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndividualsDto } from "#/modules/official/dto/individuals.dto.ts";
import { individualsExample } from "#/modules/official/dto/individuals.dto.example.ts";

/** Managed by Dryv: IndividualsDto enforces exactly what the Individuals contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndividualsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = individualsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndividualsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(individualsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...individualsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});