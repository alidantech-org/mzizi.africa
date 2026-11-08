import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureFilesListResponseDto } from "#/modules/website/dto/structure-files-list-response.dto.ts";
import { structureFilesListResponseExample } from "#/modules/website/dto/structure-files-list-response.dto.example.ts";

/** Managed by Dryv: StructureFilesListResponseDto enforces exactly what the StructureFilesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureFilesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureFilesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureFilesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureFilesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureFilesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});