import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailUnitsDto } from "#/modules/insights/schema/dto/election-detail-units.dto.ts";
import { electionDetailUnitsExample } from "@test/modules/insights/schema/dto/examples/election-detail-units.dto.example.ts";

/** Managed by Dryv: ElectionDetailUnitsDto enforces exactly what the ElectionDetailUnits contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailUnitsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailUnitsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailUnitsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailUnitsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailUnitsExample.valid(),
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
