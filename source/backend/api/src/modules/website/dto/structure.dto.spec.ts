import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDto } from "#/modules/website/dto/structure.dto.ts";
import { structureExample } from "#/modules/website/dto/structure.dto.example.ts";

/** Managed by Dryv: StructureDto enforces exactly what the Structure contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});