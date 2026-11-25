import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UsesDto } from "#/modules/media/schema/dto/uses.dto.ts";
import { usesExample } from "@test/modules/media/schema/dto/examples/uses.dto.example.ts";

/** Managed by Dryv: UsesDto enforces exactly what the Uses contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UsesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = usesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UsesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(usesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...usesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
