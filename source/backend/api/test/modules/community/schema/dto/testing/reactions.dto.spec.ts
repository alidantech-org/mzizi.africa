import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReactionsDto } from "#/modules/community/schema/dto/reactions.dto.ts";
import { reactionsExample } from "@test/modules/community/schema/dto/examples/reactions.dto.example.ts";

/** Managed by Dryv: ReactionsDto enforces exactly what the Reactions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReactionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = reactionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReactionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(reactionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...reactionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
