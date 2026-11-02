import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDto } from "#/modules/elections/dto/election.dto.ts";
import { electionExample } from "#/modules/elections/dto/election.dto.example.ts";

/** Managed by Dryv: ElectionDto enforces exactly what the Election contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});