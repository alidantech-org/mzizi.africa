import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureInputDto } from "#/modules/structure/schema/dto/structure-input.dto.ts";
import { structureInputExample } from "@test/modules/structure/schema/dto/examples/structure-input.dto.example.ts";

/** Managed by Dryv: StructureInputDto enforces exactly what the StructureInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StructureInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
