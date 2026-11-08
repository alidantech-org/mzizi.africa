import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumResultPublicDto } from "#/modules/elections/dto/referendum-result-public.dto.ts";
import { referendumResultPublicExample } from "#/modules/elections/dto/referendum-result-public.dto.example.ts";

/** Managed by Dryv: ReferendumResultPublicDto enforces exactly what the ReferendumResultPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumResultPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumResultPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumResultPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumResultPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumResultPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});