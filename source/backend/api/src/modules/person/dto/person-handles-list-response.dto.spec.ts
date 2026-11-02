import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonHandlesListResponseDto } from "#/modules/person/dto/person-handles-list-response.dto.ts";
import { personHandlesListResponseExample } from "#/modules/person/dto/person-handles-list-response.dto.example.ts";

/** Managed by Dryv: PersonHandlesListResponseDto enforces exactly what the PersonHandlesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonHandlesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personHandlesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonHandlesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personHandlesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personHandlesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});