import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileVersionsListResponseDto } from "#/modules/filesystem/dto/file-versions-list-response.dto.ts";
import { fileVersionsListResponseExample } from "#/modules/filesystem/dto/file-versions-list-response.dto.example.ts";

/** Managed by Dryv: FileVersionsListResponseDto enforces exactly what the FileVersionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileVersionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileVersionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileVersionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileVersionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileVersionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});