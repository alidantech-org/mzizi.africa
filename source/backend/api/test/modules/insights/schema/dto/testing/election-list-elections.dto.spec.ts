import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionListElectionsDto } from "#/modules/insights/schema/dto/election-list-elections.dto.ts";
import { electionListElectionsExample } from "@test/modules/insights/schema/dto/examples/election-list-elections.dto.example.ts";

/** Managed by Dryv: ElectionListElectionsDto enforces exactly what the ElectionListElections contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionListElectionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionListElectionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionListElectionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionListElectionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionListElectionsExample.valid(),
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
