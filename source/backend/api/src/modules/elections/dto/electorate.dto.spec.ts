import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectorateDto } from "#/modules/elections/dto/electorate.dto.ts";
import { electorateExample } from "#/modules/elections/dto/electorate.dto.example.ts";

/** Managed by Dryv: ElectorateDto enforces exactly what the Electorate contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectorateDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electorateExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectorateDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electorateExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electorateExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});