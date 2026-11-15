import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionCollectionDto } from "#/modules/governance/schema/dto/institution-collection.dto.ts";
import { institutionCollectionExample } from "@test/modules/governance/schema/dto/examples/institution-collection.dto.example.ts";

/** Managed by Dryv: InstitutionCollectionDto enforces exactly what the InstitutionCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionCollectionExample.valid(),
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
