import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionAtInputDto } from "#/modules/insights/schema/dto/election-at-input.dto.ts";
import { electionAtInputExample } from "@test/modules/insights/schema/dto/examples/election-at-input.dto.example.ts";

/** Managed by Dryv: ElectionAtInputDto enforces exactly what the ElectionAtInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionAtInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionAtInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionAtInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionAtInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionAtInputExample.valid(),
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
