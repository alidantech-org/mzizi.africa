import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SchemeDetailLabelsDto } from "#/modules/vocabulary/schema/dto/scheme-detail-labels.dto.ts";
import { schemeDetailLabelsExample } from "@test/modules/vocabulary/schema/dto/examples/scheme-detail-labels.dto.example.ts";

/** Managed by Dryv: SchemeDetailLabelsDto enforces exactly what the SchemeDetailLabels contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SchemeDetailLabelsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = schemeDetailLabelsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SchemeDetailLabelsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(schemeDetailLabelsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...schemeDetailLabelsExample.valid(),
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
