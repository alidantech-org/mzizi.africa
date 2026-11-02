import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FolderResponseDto } from "#/modules/filesystem/dto/folder-response.dto.ts";
import { folderResponseExample } from "#/modules/filesystem/dto/folder-response.dto.example.ts";

/** Managed by Dryv: FolderResponseDto enforces exactly what the FolderResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FolderResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = folderResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FolderResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(folderResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...folderResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});