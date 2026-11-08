import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonResponseDto } from "#/modules/person/dto/person-response.dto.ts";
import { personResponseExample } from "#/modules/person/dto/person-response.dto.example.ts";

/** Managed by Dryv: PersonResponseDto enforces exactly what the PersonResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});