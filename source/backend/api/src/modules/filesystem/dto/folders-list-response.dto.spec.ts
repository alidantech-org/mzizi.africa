import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FoldersListResponseDto } from "#/modules/filesystem/dto/folders-list-response.dto.ts";
import { foldersListResponseExample } from "#/modules/filesystem/dto/folders-list-response.dto.example.ts";

/** Managed by Dryv: FoldersListResponseDto enforces exactly what the FoldersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FoldersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = foldersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FoldersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(foldersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...foldersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});