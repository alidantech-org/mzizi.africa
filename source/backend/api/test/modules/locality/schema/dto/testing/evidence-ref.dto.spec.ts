import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceRefDto } from "#/modules/locality/schema/dto/evidence-ref.dto.ts";
import { evidenceRefExample } from "@test/modules/locality/schema/dto/examples/evidence-ref.dto.example.ts";

/** Managed by Dryv: EvidenceRefDto enforces exactly what the EvidenceRef contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceRefDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceRefExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceRefDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceRefExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceRefExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
