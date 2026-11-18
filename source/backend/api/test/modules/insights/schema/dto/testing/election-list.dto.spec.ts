import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionListDto } from "#/modules/insights/schema/dto/election-list.dto.ts";
import { electionListExample } from "@test/modules/insights/schema/dto/examples/election-list.dto.example.ts";

/** Managed by Dryv: ElectionListDto enforces exactly what the ElectionList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
