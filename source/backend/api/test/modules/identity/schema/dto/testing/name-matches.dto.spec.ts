import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NameMatchesDto } from "#/modules/identity/schema/dto/name-matches.dto.ts";
import { nameMatchesExample } from "@test/modules/identity/schema/dto/examples/name-matches.dto.example.ts";

/** Managed by Dryv: NameMatchesDto enforces exactly what the NameMatches contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NameMatchesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = nameMatchesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NameMatchesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(nameMatchesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...nameMatchesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
