import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionListElectionsRunnerUpDto } from "#/modules/insights/schema/dto/election-list-elections-runner-up.dto.ts";
import { electionListElectionsRunnerUpExample } from "@test/modules/insights/schema/dto/examples/election-list-elections-runner-up.dto.example.ts";

/** Managed by Dryv: ElectionListElectionsRunnerUpDto enforces exactly what the ElectionListElectionsRunnerUp contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionListElectionsRunnerUpDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionListElectionsRunnerUpExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionListElectionsRunnerUpDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionListElectionsRunnerUpExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionListElectionsRunnerUpExample.valid(),
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
