import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceReferencesListResponseDto } from "#/modules/audit/dto/evidence-references-list-response.dto.ts";
import { evidenceReferencesListResponseExample } from "#/modules/audit/dto/evidence-references-list-response.dto.example.ts";

/** Managed by Dryv: EvidenceReferencesListResponseDto enforces exactly what the EvidenceReferencesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceReferencesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceReferencesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceReferencesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceReferencesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceReferencesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});