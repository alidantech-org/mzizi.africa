import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FoldersDto } from "#/modules/filesystem/schema/dto/folders.dto.ts";
import { foldersExample } from "#/modules/filesystem/schema/dto/examples/folders.dto.example.ts";

/** Managed by Dryv: FoldersDto enforces exactly what the Folders contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FoldersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = foldersExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FoldersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(foldersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...foldersExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});