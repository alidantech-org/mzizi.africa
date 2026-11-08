import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonHandleResponseDto } from "#/modules/person/dto/person-handle-response.dto.ts";
import { personHandleResponseExample } from "#/modules/person/dto/person-handle-response.dto.example.ts";

/** Managed by Dryv: PersonHandleResponseDto enforces exactly what the PersonHandleResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonHandleResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personHandleResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonHandleResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personHandleResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personHandleResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});