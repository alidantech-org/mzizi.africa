import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureDocumentFunctionsAssignmentsDto } from "#/modules/structure/schema/dto/structure-document-functions-assignments.dto.ts";
import { structureDocumentFunctionsAssignmentsExample } from "@test/modules/structure/schema/dto/examples/structure-document-functions-assignments.dto.example.ts";

/** Managed by Dryv: StructureDocumentFunctionsAssignmentsDto enforces exactly what the StructureDocumentFunctionsAssignments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureDocumentFunctionsAssignmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureDocumentFunctionsAssignmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureDocumentFunctionsAssignmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureDocumentFunctionsAssignmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...structureDocumentFunctionsAssignmentsExample.valid(),
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
