import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureVersionResponseDto } from "#/modules/website/dto/structure-version-response.dto.ts";
import { structureVersionResponseExample } from "#/modules/website/dto/structure-version-response.dto.example.ts";

/** Managed by Dryv: StructureVersionResponseDto enforces exactly what the StructureVersionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureVersionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureVersionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureVersionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureVersionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureVersionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});