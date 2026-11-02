import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CreateEvidenceReferenceBodyDto } from "#/modules/audit/dto/create-evidence-reference-body.dto.ts";
import { createEvidenceReferenceBodyExample } from "#/modules/audit/dto/create-evidence-reference-body.dto.example.ts";

/** Managed by Dryv: CreateEvidenceReferenceBodyDto enforces exactly what the CreateEvidenceReferenceBody contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CreateEvidenceReferenceBodyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = createEvidenceReferenceBodyExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CreateEvidenceReferenceBodyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(createEvidenceReferenceBodyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...createEvidenceReferenceBodyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});