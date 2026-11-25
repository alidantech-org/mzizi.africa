import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ResultsDto } from "#/modules/election/schema/dto/results.dto.ts";
import { resultsExample } from "@test/modules/election/schema/dto/examples/results.dto.example.ts";

/** Managed by Dryv: ResultsDto enforces exactly what the Results contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ResultsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = resultsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ResultsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(resultsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...resultsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
