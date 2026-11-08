import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonProfileDto } from "#/modules/person/dto/person-profile.dto.ts";
import { personProfileExample } from "#/modules/person/dto/person-profile.dto.example.ts";

/** Managed by Dryv: PersonProfileDto enforces exactly what the PersonProfile contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonProfileDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personProfileExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonProfileDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personProfileExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personProfileExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});