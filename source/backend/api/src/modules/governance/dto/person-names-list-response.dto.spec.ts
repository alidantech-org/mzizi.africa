import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonNamesListResponseDto } from "#/modules/governance/dto/person-names-list-response.dto.ts";
import { personNamesListResponseExample } from "#/modules/governance/dto/person-names-list-response.dto.example.ts";

/** Managed by Dryv: PersonNamesListResponseDto enforces exactly what the PersonNamesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonNamesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personNamesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonNamesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personNamesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personNamesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});