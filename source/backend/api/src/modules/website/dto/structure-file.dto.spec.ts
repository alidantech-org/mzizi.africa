import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureFileDto } from "#/modules/website/dto/structure-file.dto.ts";
import { structureFileExample } from "#/modules/website/dto/structure-file.dto.example.ts";

/** Managed by Dryv: StructureFileDto enforces exactly what the StructureFile contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureFileDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureFileExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureFileDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureFileExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureFileExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});