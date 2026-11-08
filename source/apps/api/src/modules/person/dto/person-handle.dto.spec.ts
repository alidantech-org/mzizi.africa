import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonHandleDto } from "#/modules/person/dto/person-handle.dto.ts";
import { personHandleExample } from "#/modules/person/dto/person-handle.dto.example.ts";

/** Managed by Dryv: PersonHandleDto enforces exactly what the PersonHandle contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonHandleDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personHandleExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonHandleDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personHandleExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personHandleExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});