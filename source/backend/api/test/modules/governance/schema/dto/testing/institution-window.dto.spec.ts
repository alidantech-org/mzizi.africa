import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionWindowDto } from "#/modules/governance/schema/dto/institution-window.dto.ts";
import { institutionWindowExample } from "@test/modules/governance/schema/dto/examples/institution-window.dto.example.ts";

/** Managed by Dryv: InstitutionWindowDto enforces exactly what the InstitutionWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionWindowExample.valid(),
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
