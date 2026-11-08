import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileDto } from "#/modules/filesystem/dto/file.dto.ts";
import { fileExample } from "#/modules/filesystem/dto/file.dto.example.ts";

/** Managed by Dryv: FileDto enforces exactly what the File contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});