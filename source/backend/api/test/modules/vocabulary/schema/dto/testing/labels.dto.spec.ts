import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LabelsDto } from "#/modules/vocabulary/schema/dto/labels.dto.ts";
import { labelsExample } from "@test/modules/vocabulary/schema/dto/examples/labels.dto.example.ts";

/** Managed by Dryv: LabelsDto enforces exactly what the Labels contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LabelsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = labelsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LabelsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(labelsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...labelsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
