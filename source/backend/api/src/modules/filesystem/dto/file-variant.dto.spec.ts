import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileVariantDto } from "#/modules/filesystem/dto/file-variant.dto.ts";
import { fileVariantExample } from "#/modules/filesystem/dto/file-variant.dto.example.ts";

/** Managed by Dryv: FileVariantDto enforces exactly what the FileVariant contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileVariantDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileVariantExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileVariantDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileVariantExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileVariantExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});