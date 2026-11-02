import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceReferenceResponseDto } from "#/modules/audit/dto/evidence-reference-response.dto.ts";
import { evidenceReferenceResponseExample } from "#/modules/audit/dto/evidence-reference-response.dto.example.ts";

/** Managed by Dryv: EvidenceReferenceResponseDto enforces exactly what the EvidenceReferenceResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceReferenceResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceReferenceResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceReferenceResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceReferenceResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceReferenceResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});