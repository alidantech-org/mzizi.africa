import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FolderDto } from "#/modules/filesystem/dto/folder.dto.ts";
import { folderExample } from "#/modules/filesystem/dto/folder.dto.example.ts";

/** Managed by Dryv: FolderDto enforces exactly what the Folder contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FolderDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = folderExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FolderDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(folderExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...folderExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});