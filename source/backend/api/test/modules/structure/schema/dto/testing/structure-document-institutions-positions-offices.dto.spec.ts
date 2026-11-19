import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentInstitutionsPositionsOfficesDto } from "#/modules/structure/schema/dto/structure-document-institutions-positions-offices.dto.ts";
import { structureDocumentInstitutionsPositionsOfficesExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-positions-offices.dto.example.ts";

/** Managed by Dryv: StructureDocumentInstitutionsPositionsOfficesDto enforces exactly what the StructureDocumentInstitutionsPositionsOffices contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(StructureDocumentInstitutionsPositionsOfficesDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = structureDocumentInstitutionsPositionsOfficesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentInstitutionsPositionsOfficesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentInstitutionsPositionsOfficesExample.valid())).toEqual(
      [],
    );
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentInstitutionsPositionsOfficesExample.valid(),
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
