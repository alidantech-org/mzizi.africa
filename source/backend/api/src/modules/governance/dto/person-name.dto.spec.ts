import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonNameDto } from "#/modules/governance/dto/person-name.dto.ts";
import { personNameExample } from "#/modules/governance/dto/person-name.dto.example.ts";

/** Managed by Dryv: PersonNameDto enforces exactly what the PersonName contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonNameDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personNameExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonNameDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personNameExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personNameExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});