import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SearchInputDto } from "#/modules/locality/schema/dto/search-input.dto.ts";
import { searchInputExample } from "@test/modules/locality/schema/dto/examples/search-input.dto.example.ts";

/** Managed by Dryv: SearchInputDto enforces exactly what the SearchInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SearchInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = searchInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SearchInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(searchInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...searchInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
