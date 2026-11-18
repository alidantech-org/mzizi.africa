import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeasonsDto } from "#/modules/event/schema/dto/seasons.dto.ts";
import { seasonsExample } from "@test/modules/event/schema/dto/examples/seasons.dto.example.ts";

/** Managed by Dryv: SeasonsDto enforces exactly what the Seasons contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeasonsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seasonsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SeasonsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seasonsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seasonsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
