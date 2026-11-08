import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileVersionResponseDto } from "#/modules/filesystem/dto/file-version-response.dto.ts";
import { fileVersionResponseExample } from "#/modules/filesystem/dto/file-version-response.dto.example.ts";

/** Managed by Dryv: FileVersionResponseDto enforces exactly what the FileVersionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileVersionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileVersionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileVersionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileVersionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileVersionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});