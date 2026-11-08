import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FolderPublicDto } from "#/modules/filesystem/dto/folder-public.dto.ts";
import { folderPublicExample } from "#/modules/filesystem/dto/folder-public.dto.example.ts";

/** Managed by Dryv: FolderPublicDto enforces exactly what the FolderPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FolderPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = folderPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FolderPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(folderPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...folderPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});