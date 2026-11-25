import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SearchRequestDto } from "#/modules/frontend/schema/dto/search-request.dto.ts";
import { searchRequestExample } from "@test/modules/frontend/schema/dto/examples/search-request.dto.example.ts";

/** Managed by Dryv: SearchRequestDto enforces exactly what the SearchRequest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SearchRequestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = searchRequestExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SearchRequestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(searchRequestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...searchRequestExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
