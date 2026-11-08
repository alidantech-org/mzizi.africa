import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonHandlePublicDto } from "#/modules/person/dto/person-handle-public.dto.ts";
import { personHandlePublicExample } from "#/modules/person/dto/person-handle-public.dto.example.ts";

/** Managed by Dryv: PersonHandlePublicDto enforces exactly what the PersonHandlePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonHandlePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personHandlePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonHandlePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personHandlePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personHandlePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});