import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ClassificationsDto } from "#/modules/geography/schema/dto/classifications.dto.ts";
import { classificationsExample } from "@test/modules/geography/schema/dto/examples/classifications.dto.example.ts";

/** Managed by Dryv: ClassificationsDto enforces exactly what the Classifications contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ClassificationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = classificationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ClassificationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(classificationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...classificationsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
