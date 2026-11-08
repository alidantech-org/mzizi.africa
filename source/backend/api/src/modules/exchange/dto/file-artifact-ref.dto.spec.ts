import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileArtifactRefDto } from "#/modules/exchange/dto/file-artifact-ref.dto.ts";
import { fileArtifactRefExample } from "#/modules/exchange/dto/file-artifact-ref.dto.example.ts";

/** Managed by Dryv: FileArtifactRefDto enforces exactly what the FileArtifactRef contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileArtifactRefDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileArtifactRefExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileArtifactRefDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileArtifactRefExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileArtifactRefExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});