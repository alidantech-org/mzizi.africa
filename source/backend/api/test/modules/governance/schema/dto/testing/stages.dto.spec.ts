import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StagesDto } from "#/modules/governance/schema/dto/stages.dto.ts";
import { stagesExample } from "@test/modules/governance/schema/dto/examples/stages.dto.example.ts";

/** Managed by Dryv: StagesDto enforces exactly what the Stages contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StagesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = stagesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StagesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(stagesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...stagesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
