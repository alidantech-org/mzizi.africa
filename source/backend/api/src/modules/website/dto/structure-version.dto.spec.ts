import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureVersionDto } from "#/modules/website/dto/structure-version.dto.ts";
import { structureVersionExample } from "#/modules/website/dto/structure-version.dto.example.ts";

/** Managed by Dryv: StructureVersionDto enforces exactly what the StructureVersion contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureVersionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureVersionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureVersionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureVersionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureVersionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});