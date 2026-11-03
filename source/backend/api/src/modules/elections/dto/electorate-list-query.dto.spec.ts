import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectorateListQueryDto } from "#/modules/elections/dto/electorate-list-query.dto.ts";
import { electorateListQueryExample } from "#/modules/elections/dto/electorate-list-query.dto.example.ts";

/** Managed by Dryv: ElectorateListQueryDto enforces exactly what the ElectorateListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectorateListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electorateListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectorateListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electorateListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electorateListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});