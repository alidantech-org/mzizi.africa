import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileEventDto } from "#/modules/filesystem/dto/file-event.dto.ts";
import { fileEventExample } from "#/modules/filesystem/dto/file-event.dto.example.ts";

/** Managed by Dryv: FileEventDto enforces exactly what the FileEvent contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileEventDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileEventExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileEventDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileEventExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileEventExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});