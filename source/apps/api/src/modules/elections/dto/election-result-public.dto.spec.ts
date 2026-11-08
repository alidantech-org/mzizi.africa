import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionResultPublicDto } from "#/modules/elections/dto/election-result-public.dto.ts";
import { electionResultPublicExample } from "#/modules/elections/dto/election-result-public.dto.example.ts";

/** Managed by Dryv: ElectionResultPublicDto enforces exactly what the ElectionResultPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionResultPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionResultPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionResultPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionResultPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionResultPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});