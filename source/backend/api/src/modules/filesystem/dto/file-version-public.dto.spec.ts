import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileVersionPublicDto } from "#/modules/filesystem/dto/file-version-public.dto.ts";
import { fileVersionPublicExample } from "#/modules/filesystem/dto/file-version-public.dto.example.ts";

/** Managed by Dryv: FileVersionPublicDto enforces exactly what the FileVersionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileVersionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileVersionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileVersionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileVersionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileVersionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});