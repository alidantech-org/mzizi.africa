import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BrowseInputDto } from "#/modules/insights/schema/dto/browse-input.dto.ts";
import { browseInputExample } from "@test/modules/insights/schema/dto/examples/browse-input.dto.example.ts";

/** Managed by Dryv: BrowseInputDto enforces exactly what the BrowseInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BrowseInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = browseInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BrowseInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(browseInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...browseInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
