import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonNameResponseDto } from "#/modules/person/dto/person-name-response.dto.ts";
import { personNameResponseExample } from "#/modules/person/dto/person-name-response.dto.example.ts";

/** Managed by Dryv: PersonNameResponseDto enforces exactly what the PersonNameResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonNameResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personNameResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonNameResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personNameResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personNameResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});