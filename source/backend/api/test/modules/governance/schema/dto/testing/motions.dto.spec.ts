import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionsDto } from "#/modules/governance/schema/dto/motions.dto.ts";
import { motionsExample } from "@test/modules/governance/schema/dto/examples/motions.dto.example.ts";

/** Managed by Dryv: MotionsDto enforces exactly what the Motions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...motionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
