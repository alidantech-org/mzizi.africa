import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FilesListResponseDto } from "#/modules/filesystem/dto/files-list-response.dto.ts";
import { filesListResponseExample } from "#/modules/filesystem/dto/files-list-response.dto.example.ts";

/** Managed by Dryv: FilesListResponseDto enforces exactly what the FilesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FilesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = filesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FilesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(filesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...filesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});