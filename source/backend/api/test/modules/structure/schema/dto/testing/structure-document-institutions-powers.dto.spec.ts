import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentInstitutionsPowersDto } from "#/modules/structure/schema/dto/structure-document-institutions-powers.dto.ts";
import { structureDocumentInstitutionsPowersExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-powers.dto.example.ts";

/** Managed by Dryv: StructureDocumentInstitutionsPowersDto enforces exactly what the StructureDocumentInstitutionsPowers contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDocumentInstitutionsPowersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureDocumentInstitutionsPowersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentInstitutionsPowersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentInstitutionsPowersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentInstitutionsPowersExample.valid(),
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
