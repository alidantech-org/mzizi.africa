import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CitationInputDto } from "#/modules/locality/schema/dto/citation-input.dto.ts";
import { citationInputExample } from "@test/modules/locality/schema/dto/examples/citation-input.dto.example.ts";

/** Managed by Dryv: CitationInputDto enforces exactly what the CitationInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CitationInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = citationInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CitationInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(citationInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...citationInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
