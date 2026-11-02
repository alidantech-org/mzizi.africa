import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PeopleListResponseDto } from "#/modules/person/dto/people-list-response.dto.ts";
import { peopleListResponseExample } from "#/modules/person/dto/people-list-response.dto.example.ts";

/** Managed by Dryv: PeopleListResponseDto enforces exactly what the PeopleListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PeopleListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = peopleListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PeopleListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(peopleListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...peopleListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});