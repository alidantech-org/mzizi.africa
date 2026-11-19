import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailChildrenRelationDto } from "#/modules/insights/schema/dto/institution-detail-children-relation.dto.ts";
import { institutionDetailChildrenRelationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-children-relation.dto.example.ts";

/** Managed by Dryv: InstitutionDetailChildrenRelationDto enforces exactly what the InstitutionDetailChildrenRelation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailChildrenRelationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailChildrenRelationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailChildrenRelationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailChildrenRelationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailChildrenRelationExample.valid(),
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
