import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TurnoutsDto } from "#/modules/election/schema/dto/turnouts.dto.ts";
import { turnoutsExample } from "@test/modules/election/schema/dto/examples/turnouts.dto.example.ts";

/** Managed by Dryv: TurnoutsDto enforces exactly what the Turnouts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TurnoutsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = turnoutsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TurnoutsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(turnoutsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...turnoutsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
