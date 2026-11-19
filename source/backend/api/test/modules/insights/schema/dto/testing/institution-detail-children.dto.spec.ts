import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailChildrenDto } from "#/modules/insights/schema/dto/institution-detail-children.dto.ts";
import { institutionDetailChildrenExample } from "@test/modules/insights/schema/dto/examples/institution-detail-children.dto.example.ts";

/** Managed by Dryv: InstitutionDetailChildrenDto enforces exactly what the InstitutionDetailChildren contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailChildrenDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailChildrenExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailChildrenDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailChildrenExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailChildrenExample.valid(),
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
