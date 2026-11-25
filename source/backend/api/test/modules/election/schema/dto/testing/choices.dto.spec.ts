import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChoicesDto } from "#/modules/election/schema/dto/choices.dto.ts";
import { choicesExample } from "@test/modules/election/schema/dto/examples/choices.dto.example.ts";

/** Managed by Dryv: ChoicesDto enforces exactly what the Choices contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChoicesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = choicesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChoicesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(choicesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...choicesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
