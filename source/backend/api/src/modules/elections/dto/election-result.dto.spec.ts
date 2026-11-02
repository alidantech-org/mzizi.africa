import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionResultDto } from "#/modules/elections/dto/election-result.dto.ts";
import { electionResultExample } from "#/modules/elections/dto/election-result.dto.example.ts";

/** Managed by Dryv: ElectionResultDto enforces exactly what the ElectionResult contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionResultDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionResultExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionResultDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionResultExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionResultExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});