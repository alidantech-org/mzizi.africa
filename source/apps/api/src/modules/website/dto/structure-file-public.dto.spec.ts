import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureFilePublicDto } from "#/modules/website/dto/structure-file-public.dto.ts";
import { structureFilePublicExample } from "#/modules/website/dto/structure-file-public.dto.example.ts";

/** Managed by Dryv: StructureFilePublicDto enforces exactly what the StructureFilePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureFilePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureFilePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureFilePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureFilePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureFilePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});