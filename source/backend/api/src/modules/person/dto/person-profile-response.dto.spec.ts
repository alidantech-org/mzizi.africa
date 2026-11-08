import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonProfileResponseDto } from "#/modules/person/dto/person-profile-response.dto.ts";
import { personProfileResponseExample } from "#/modules/person/dto/person-profile-response.dto.example.ts";

/** Managed by Dryv: PersonProfileResponseDto enforces exactly what the PersonProfileResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonProfileResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personProfileResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonProfileResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personProfileResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personProfileResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});