import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RowEvidenceDto } from "#/modules/source/schema/dto/row-evidence.dto.ts";
import { rowEvidenceExample } from "@test/modules/source/schema/dto/examples/row-evidence.dto.example.ts";

/** Managed by Dryv: RowEvidenceDto enforces exactly what the RowEvidence contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RowEvidenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rowEvidenceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RowEvidenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rowEvidenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...rowEvidenceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
