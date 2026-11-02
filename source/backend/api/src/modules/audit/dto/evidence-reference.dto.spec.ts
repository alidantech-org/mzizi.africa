import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceReferenceDto } from "#/modules/audit/dto/evidence-reference.dto.ts";
import { evidenceReferenceExample } from "#/modules/audit/dto/evidence-reference.dto.example.ts";

/** Managed by Dryv: EvidenceReferenceDto enforces exactly what the EvidenceReference contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceReferenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceReferenceExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceReferenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceReferenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceReferenceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});