import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentInstitutionsPositionsPowersDto } from "#/modules/structure/schema/dto/structure-document-institutions-positions-powers.dto.ts";
import { structureDocumentInstitutionsPositionsPowersExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-positions-powers.dto.example.ts";

/** Managed by Dryv: StructureDocumentInstitutionsPositionsPowersDto enforces exactly what the StructureDocumentInstitutionsPositionsPowers contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(StructureDocumentInstitutionsPositionsPowersDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = structureDocumentInstitutionsPositionsPowersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentInstitutionsPositionsPowersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentInstitutionsPositionsPowersExample.valid())).toEqual(
      [],
    );
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentInstitutionsPositionsPowersExample.valid(),
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
