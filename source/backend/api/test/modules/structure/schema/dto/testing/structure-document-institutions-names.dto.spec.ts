import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentInstitutionsNamesDto } from "#/modules/structure/schema/dto/structure-document-institutions-names.dto.ts";
import { structureDocumentInstitutionsNamesExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-names.dto.example.ts";

/** Managed by Dryv: StructureDocumentInstitutionsNamesDto enforces exactly what the StructureDocumentInstitutionsNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDocumentInstitutionsNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureDocumentInstitutionsNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentInstitutionsNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentInstitutionsNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentInstitutionsNamesExample.valid(),
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
