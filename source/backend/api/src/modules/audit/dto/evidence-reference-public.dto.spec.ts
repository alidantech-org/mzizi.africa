import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceReferencePublicDto } from "#/modules/audit/dto/evidence-reference-public.dto.ts";
import { evidenceReferencePublicExample } from "#/modules/audit/dto/evidence-reference-public.dto.example.ts";

/** Managed by Dryv: EvidenceReferencePublicDto enforces exactly what the EvidenceReferencePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceReferencePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceReferencePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceReferencePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceReferencePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceReferencePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});