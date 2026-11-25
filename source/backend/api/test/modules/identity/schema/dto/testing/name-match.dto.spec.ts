import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NameMatchDto } from "#/modules/identity/schema/dto/name-match.dto.ts";
import { nameMatchExample } from "@test/modules/identity/schema/dto/examples/name-match.dto.example.ts";

/** Managed by Dryv: NameMatchDto enforces exactly what the NameMatch contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NameMatchDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = nameMatchExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NameMatchDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(nameMatchExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...nameMatchExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
