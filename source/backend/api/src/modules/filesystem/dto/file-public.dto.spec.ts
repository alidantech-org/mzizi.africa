import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FilePublicDto } from "#/modules/filesystem/dto/file-public.dto.ts";
import { filePublicExample } from "#/modules/filesystem/dto/file-public.dto.example.ts";

/** Managed by Dryv: FilePublicDto enforces exactly what the FilePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FilePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = filePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FilePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(filePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...filePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});