import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionsDto } from "#/modules/election/schema/dto/elections.dto.ts";
import { electionsExample } from "@test/modules/election/schema/dto/examples/elections.dto.example.ts";

/** Managed by Dryv: ElectionsDto enforces exactly what the Elections contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
