import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonContactPublicDto } from "#/modules/person/dto/person-contact-public.dto.ts";
import { personContactPublicExample } from "#/modules/person/dto/person-contact-public.dto.example.ts";

/** Managed by Dryv: PersonContactPublicDto enforces exactly what the PersonContactPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonContactPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personContactPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonContactPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personContactPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personContactPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});