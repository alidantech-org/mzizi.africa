import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountdownDto } from "#/modules/experience/schema/dto/countdown.dto.ts";
import { countdownExample } from "@test/modules/experience/schema/dto/examples/countdown.dto.example.ts";

/** Managed by Dryv: CountdownDto enforces exactly what the Countdown contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountdownDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countdownExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountdownDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countdownExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countdownExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
