import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SourceSearchInputDto } from "#/modules/locality/schema/dto/source-search-input.dto.ts";
import { sourceSearchInputExample } from "@test/modules/locality/schema/dto/examples/source-search-input.dto.example.ts";

/** Managed by Dryv: SourceSearchInputDto enforces exactly what the SourceSearchInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SourceSearchInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sourceSearchInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SourceSearchInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sourceSearchInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...sourceSearchInputExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
