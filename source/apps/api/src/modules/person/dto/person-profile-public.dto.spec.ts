import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonProfilePublicDto } from "#/modules/person/dto/person-profile-public.dto.ts";
import { personProfilePublicExample } from "#/modules/person/dto/person-profile-public.dto.example.ts";

/** Managed by Dryv: PersonProfilePublicDto enforces exactly what the PersonProfilePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonProfilePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personProfilePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonProfilePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personProfilePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personProfilePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});