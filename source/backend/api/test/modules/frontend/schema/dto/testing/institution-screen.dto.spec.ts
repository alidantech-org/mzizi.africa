import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionScreenDto } from "#/modules/frontend/schema/dto/institution-screen.dto.ts";
import { institutionScreenExample } from "@test/modules/frontend/schema/dto/examples/institution-screen.dto.example.ts";

/** Managed by Dryv: InstitutionScreenDto enforces exactly what the InstitutionScreen contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionScreenDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionScreenExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionScreenDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionScreenExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionScreenExample.valid(),
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
