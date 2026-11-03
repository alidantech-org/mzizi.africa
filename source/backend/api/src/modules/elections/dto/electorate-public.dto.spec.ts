import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectoratePublicDto } from "#/modules/elections/dto/electorate-public.dto.ts";
import { electoratePublicExample } from "#/modules/elections/dto/electorate-public.dto.example.ts";

/** Managed by Dryv: ElectoratePublicDto enforces exactly what the ElectoratePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectoratePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electoratePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectoratePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electoratePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electoratePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});