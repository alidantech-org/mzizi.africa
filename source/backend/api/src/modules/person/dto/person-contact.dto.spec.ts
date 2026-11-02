import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonContactDto } from "#/modules/person/dto/person-contact.dto.ts";
import { personContactExample } from "#/modules/person/dto/person-contact.dto.example.ts";

/** Managed by Dryv: PersonContactDto enforces exactly what the PersonContact contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonContactDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personContactExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonContactDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personContactExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personContactExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});