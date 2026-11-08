import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileResponseDto } from "#/modules/filesystem/dto/file-response.dto.ts";
import { fileResponseExample } from "#/modules/filesystem/dto/file-response.dto.example.ts";

/** Managed by Dryv: FileResponseDto enforces exactly what the FileResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});