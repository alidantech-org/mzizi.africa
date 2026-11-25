import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { JurisdictionsDto } from "#/modules/governance/schema/dto/jurisdictions.dto.ts";
import { jurisdictionsExample } from "@test/modules/governance/schema/dto/examples/jurisdictions.dto.example.ts";

/** Managed by Dryv: JurisdictionsDto enforces exactly what the Jurisdictions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(JurisdictionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = jurisdictionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("JurisdictionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(jurisdictionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...jurisdictionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
