import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionKeyDto } from "#/modules/election/schema/dto/election-key.dto.ts";
import { electionKeyExample } from "@test/modules/election/schema/dto/examples/election-key.dto.example.ts";

/** Managed by Dryv: ElectionKeyDto enforces exactly what the ElectionKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
