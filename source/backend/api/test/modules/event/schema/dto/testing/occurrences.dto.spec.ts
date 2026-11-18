import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OccurrencesDto } from "#/modules/event/schema/dto/occurrences.dto.ts";
import { occurrencesExample } from "@test/modules/event/schema/dto/examples/occurrences.dto.example.ts";

/** Managed by Dryv: OccurrencesDto enforces exactly what the Occurrences contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OccurrencesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = occurrencesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OccurrencesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(occurrencesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...occurrencesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
