import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonProfileListQueryDto } from "#/modules/person/dto/person-profile-list-query.dto.ts";
import { personProfileListQueryExample } from "#/modules/person/dto/person-profile-list-query.dto.example.ts";

/** Managed by Dryv: PersonProfileListQueryDto enforces exactly what the PersonProfileListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonProfileListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personProfileListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonProfileListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personProfileListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personProfileListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});