import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TimezonesDto } from "#/modules/reference/schema/dto/timezones.dto.ts";
import { timezonesExample } from "@test/modules/reference/schema/dto/examples/timezones.dto.example.ts";

/** Managed by Dryv: TimezonesDto enforces exactly what the Timezones contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TimezonesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = timezonesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TimezonesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(timezonesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...timezonesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
