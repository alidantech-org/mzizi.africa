import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContributionsDto } from "#/modules/politics/schema/dto/contributions.dto.ts";
import { contributionsExample } from "@test/modules/politics/schema/dto/examples/contributions.dto.example.ts";

/** Managed by Dryv: ContributionsDto enforces exactly what the Contributions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContributionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contributionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContributionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contributionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contributionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
