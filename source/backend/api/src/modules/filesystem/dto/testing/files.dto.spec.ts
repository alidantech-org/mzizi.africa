import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FilesDto } from "#/modules/filesystem/dto/files.dto.ts";
import { filesExample } from "#/modules/filesystem/dto/examples/files.dto.example.ts";

/** Managed by Dryv: FilesDto enforces exactly what the Files contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FilesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = filesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FilesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(filesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...filesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});