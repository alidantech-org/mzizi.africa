import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureVersionsListResponseDto } from "#/modules/website/dto/structure-versions-list-response.dto.ts";
import { structureVersionsListResponseExample } from "#/modules/website/dto/structure-versions-list-response.dto.example.ts";

/** Managed by Dryv: StructureVersionsListResponseDto enforces exactly what the StructureVersionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureVersionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureVersionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureVersionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureVersionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureVersionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});