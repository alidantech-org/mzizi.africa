import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileRelationsDto } from "#/modules/filesystem/schema/dto/file-relations.dto.ts";
import { fileRelationsExample } from "@test/modules/filesystem/schema/dto/examples/file-relations.dto.example.ts";

/** Managed by Dryv: FileRelationsDto enforces exactly what the FileRelations contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileRelationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileRelationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FileRelationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileRelationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileRelationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
