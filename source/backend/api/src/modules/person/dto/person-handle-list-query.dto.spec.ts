import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonHandleListQueryDto } from "#/modules/person/dto/person-handle-list-query.dto.ts";
import { personHandleListQueryExample } from "#/modules/person/dto/person-handle-list-query.dto.example.ts";

/** Managed by Dryv: PersonHandleListQueryDto enforces exactly what the PersonHandleListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonHandleListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personHandleListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonHandleListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personHandleListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personHandleListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});