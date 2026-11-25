import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidenceCollectionDto } from "#/modules/source/schema/dto/evidence-collection.dto.ts";
import { evidenceCollectionExample } from "@test/modules/source/schema/dto/examples/evidence-collection.dto.example.ts";

/** Managed by Dryv: EvidenceCollectionDto enforces exactly what the EvidenceCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidenceCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidenceCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EvidenceCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidenceCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...evidenceCollectionExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
