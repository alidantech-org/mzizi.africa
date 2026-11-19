import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailParentsDto } from "#/modules/insights/schema/dto/institution-detail-parents.dto.ts";
import { institutionDetailParentsExample } from "@test/modules/insights/schema/dto/examples/institution-detail-parents.dto.example.ts";

/** Managed by Dryv: InstitutionDetailParentsDto enforces exactly what the InstitutionDetailParents contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailParentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailParentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailParentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailParentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailParentsExample.valid(),
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
