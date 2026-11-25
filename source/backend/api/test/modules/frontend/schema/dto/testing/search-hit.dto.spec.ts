import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SearchHitDto } from "#/modules/frontend/schema/dto/search-hit.dto.ts";
import { searchHitExample } from "@test/modules/frontend/schema/dto/examples/search-hit.dto.example.ts";

/** Managed by Dryv: SearchHitDto enforces exactly what the SearchHit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SearchHitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = searchHitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SearchHitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(searchHitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...searchHitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
