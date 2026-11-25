import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ScoresDto } from "#/modules/civic/schema/dto/scores.dto.ts";
import { scoresExample } from "@test/modules/civic/schema/dto/examples/scores.dto.example.ts";

/** Managed by Dryv: ScoresDto enforces exactly what the Scores contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ScoresDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = scoresExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ScoresDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(scoresExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...scoresExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
