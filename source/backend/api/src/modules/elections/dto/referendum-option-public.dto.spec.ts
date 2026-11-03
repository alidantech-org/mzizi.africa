import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumOptionPublicDto } from "#/modules/elections/dto/referendum-option-public.dto.ts";
import { referendumOptionPublicExample } from "#/modules/elections/dto/referendum-option-public.dto.example.ts";

/** Managed by Dryv: ReferendumOptionPublicDto enforces exactly what the ReferendumOptionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumOptionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumOptionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumOptionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumOptionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumOptionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});