import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructureVersionListQueryDto } from "#/modules/website/dto/structure-version-list-query.dto.ts";
import { structureVersionListQueryExample } from "#/modules/website/dto/structure-version-list-query.dto.example.ts";

/** Managed by Dryv: StructureVersionListQueryDto enforces exactly what the StructureVersionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructureVersionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structureVersionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructureVersionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structureVersionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structureVersionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});