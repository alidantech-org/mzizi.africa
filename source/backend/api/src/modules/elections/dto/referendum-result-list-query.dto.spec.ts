import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumResultListQueryDto } from "#/modules/elections/dto/referendum-result-list-query.dto.ts";
import { referendumResultListQueryExample } from "#/modules/elections/dto/referendum-result-list-query.dto.example.ts";

/** Managed by Dryv: ReferendumResultListQueryDto enforces exactly what the ReferendumResultListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumResultListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumResultListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumResultListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumResultListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumResultListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});