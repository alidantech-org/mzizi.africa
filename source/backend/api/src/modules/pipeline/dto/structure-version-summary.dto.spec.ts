import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureVersionSummaryDto } from "#/modules/pipeline/dto/structure-version-summary.dto.ts";
import { structureVersionSummaryExample } from "#/modules/pipeline/dto/structure-version-summary.dto.example.ts";

/** Managed by Dryv: StructureVersionSummaryDto enforces exactly what the StructureVersionSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureVersionSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureVersionSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureVersionSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureVersionSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureVersionSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});