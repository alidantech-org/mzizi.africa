import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentProceduresDto } from "#/modules/structure/schema/dto/structure-document-procedures.dto.ts";
import { structureDocumentProceduresExample } from "@test/modules/structure/schema/dto/examples/structure-document-procedures.dto.example.ts";

/** Managed by Dryv: StructureDocumentProceduresDto enforces exactly what the StructureDocumentProcedures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDocumentProceduresDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureDocumentProceduresExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentProceduresDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentProceduresExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentProceduresExample.valid(),
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
