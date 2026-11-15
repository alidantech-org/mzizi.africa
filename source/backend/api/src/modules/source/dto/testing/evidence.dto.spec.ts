import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceDto } from "#/modules/source/dto/evidence.dto.ts";
import { evidenceExample } from "#/modules/source/dto/examples/evidence.dto.example.ts";

/** Managed by Dryv: EvidenceDto enforces exactly what the Evidence contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});