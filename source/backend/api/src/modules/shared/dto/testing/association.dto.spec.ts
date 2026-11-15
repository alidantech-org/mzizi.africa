import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssociationDto } from "#/modules/shared/dto/association.dto.ts";
import { associationExample } from "#/modules/shared/dto/examples/association.dto.example.ts";

/** Managed by Dryv: AssociationDto enforces exactly what the Association contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssociationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = associationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AssociationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(associationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...associationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});