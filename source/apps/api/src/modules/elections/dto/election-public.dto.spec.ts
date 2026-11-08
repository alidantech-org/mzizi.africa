import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionPublicDto } from "#/modules/elections/dto/election-public.dto.ts";
import { electionPublicExample } from "#/modules/elections/dto/election-public.dto.example.ts";

/** Managed by Dryv: ElectionPublicDto enforces exactly what the ElectionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});