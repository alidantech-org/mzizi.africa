import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceReferenceListQueryDto } from "#/modules/audit/dto/evidence-reference-list-query.dto.ts";
import { evidenceReferenceListQueryExample } from "#/modules/audit/dto/evidence-reference-list-query.dto.example.ts";

/** Managed by Dryv: EvidenceReferenceListQueryDto enforces exactly what the EvidenceReferenceListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceReferenceListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceReferenceListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceReferenceListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceReferenceListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceReferenceListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});