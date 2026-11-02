import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonPublicDto } from "#/modules/governance/dto/person-public.dto.ts";
import { personPublicExample } from "#/modules/governance/dto/person-public.dto.example.ts";

/** Managed by Dryv: PersonPublicDto enforces exactly what the PersonPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});