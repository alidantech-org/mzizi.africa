import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SearchQueryDto } from "#/modules/insights/schema/dto/search-query.dto.ts";
import { searchQueryExample } from "@test/modules/insights/schema/dto/examples/search-query.dto.example.ts";

/** Managed by Dryv: SearchQueryDto enforces exactly what the SearchQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SearchQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = searchQueryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SearchQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(searchQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...searchQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
