import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EvidencedEntityDto } from "#/modules/shared/dto/evidenced-entity.dto.ts";
import { evidencedEntityExample } from "#/modules/shared/dto/evidenced-entity.dto.example.ts";

/** Managed by Dryv: EvidencedEntityDto enforces exactly what the EvidencedEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EvidencedEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = evidencedEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EvidencedEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(evidencedEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...evidencedEntityExample.valid(),
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
