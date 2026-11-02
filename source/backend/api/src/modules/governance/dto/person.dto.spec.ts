import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonDto } from "#/modules/governance/dto/person.dto.ts";
import { personExample } from "#/modules/governance/dto/person.dto.example.ts";

/** Managed by Dryv: PersonDto enforces exactly what the Person contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});