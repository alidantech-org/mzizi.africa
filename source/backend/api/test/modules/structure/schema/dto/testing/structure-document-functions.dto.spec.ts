import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentFunctionsDto } from "#/modules/structure/schema/dto/structure-document-functions.dto.ts";
import { structureDocumentFunctionsExample } from "@test/modules/structure/schema/dto/examples/structure-document-functions.dto.example.ts";

/** Managed by Dryv: StructureDocumentFunctionsDto enforces exactly what the StructureDocumentFunctions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDocumentFunctionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureDocumentFunctionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentFunctionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentFunctionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentFunctionsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
