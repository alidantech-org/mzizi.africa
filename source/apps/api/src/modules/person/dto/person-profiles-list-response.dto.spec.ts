import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonProfilesListResponseDto } from "#/modules/person/dto/person-profiles-list-response.dto.ts";
import { personProfilesListResponseExample } from "#/modules/person/dto/person-profiles-list-response.dto.example.ts";

/** Managed by Dryv: PersonProfilesListResponseDto enforces exactly what the PersonProfilesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonProfilesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personProfilesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonProfilesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personProfilesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personProfilesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});