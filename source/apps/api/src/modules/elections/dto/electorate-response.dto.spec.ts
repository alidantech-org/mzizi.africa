import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectorateResponseDto } from "#/modules/elections/dto/electorate-response.dto.ts";
import { electorateResponseExample } from "#/modules/elections/dto/electorate-response.dto.example.ts";

/** Managed by Dryv: ElectorateResponseDto enforces exactly what the ElectorateResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectorateResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electorateResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectorateResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electorateResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electorateResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});