import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonNameListQueryDto } from "#/modules/governance/dto/person-name-list-query.dto.ts";
import { personNameListQueryExample } from "#/modules/governance/dto/person-name-list-query.dto.example.ts";

/** Managed by Dryv: PersonNameListQueryDto enforces exactly what the PersonNameListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonNameListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personNameListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonNameListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personNameListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personNameListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});