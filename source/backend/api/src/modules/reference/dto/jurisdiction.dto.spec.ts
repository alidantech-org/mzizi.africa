import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { JurisdictionDto } from "#/modules/reference/dto/jurisdiction.dto.ts";
import { jurisdictionExample } from "#/modules/reference/dto/jurisdiction.dto.example.ts";

/** Managed by Dryv: JurisdictionDto enforces exactly what the Jurisdiction contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(JurisdictionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = jurisdictionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("JurisdictionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(jurisdictionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({ ...jurisdictionExample.valid(), unexpectedField: 1 }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
