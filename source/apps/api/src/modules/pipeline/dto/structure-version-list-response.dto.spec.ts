import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureVersionListResponseDto } from "#/modules/pipeline/dto/structure-version-list-response.dto.ts";
import { structureVersionListResponseExample } from "#/modules/pipeline/dto/structure-version-list-response.dto.example.ts";

/** Managed by Dryv: StructureVersionListResponseDto enforces exactly what the StructureVersionListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureVersionListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureVersionListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureVersionListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureVersionListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureVersionListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});