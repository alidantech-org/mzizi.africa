import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListDto } from "#/modules/insights/schema/dto/institution-list.dto.ts";
import { institutionListExample } from "@test/modules/insights/schema/dto/examples/institution-list.dto.example.ts";

/** Managed by Dryv: InstitutionListDto enforces exactly what the InstitutionList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionListExample.valid(),
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
