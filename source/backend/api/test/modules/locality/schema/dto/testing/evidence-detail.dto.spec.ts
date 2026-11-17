import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceDetailDto } from "#/modules/locality/schema/dto/evidence-detail.dto.ts";
import { evidenceDetailExample } from "@test/modules/locality/schema/dto/examples/evidence-detail.dto.example.ts";

/** Managed by Dryv: EvidenceDetailDto enforces exactly what the EvidenceDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...evidenceDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
