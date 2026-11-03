import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumOptionDto } from "#/modules/elections/dto/referendum-option.dto.ts";
import { referendumOptionExample } from "#/modules/elections/dto/referendum-option.dto.example.ts";

/** Managed by Dryv: ReferendumOptionDto enforces exactly what the ReferendumOption contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumOptionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumOptionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumOptionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumOptionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumOptionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});