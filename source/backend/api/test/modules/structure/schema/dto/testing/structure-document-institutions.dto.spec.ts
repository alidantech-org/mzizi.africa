import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentInstitutionsDto } from "#/modules/structure/schema/dto/structure-document-institutions.dto.ts";
import { structureDocumentInstitutionsExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions.dto.example.ts";

/** Managed by Dryv: StructureDocumentInstitutionsDto enforces exactly what the StructureDocumentInstitutions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDocumentInstitutionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureDocumentInstitutionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentInstitutionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentInstitutionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentInstitutionsExample.valid(),
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
