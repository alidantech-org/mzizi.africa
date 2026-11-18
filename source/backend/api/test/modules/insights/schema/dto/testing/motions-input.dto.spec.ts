import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionsInputDto } from "#/modules/insights/schema/dto/motions-input.dto.ts";
import { motionsInputExample } from "@test/modules/insights/schema/dto/examples/motions-input.dto.example.ts";

/** Managed by Dryv: MotionsInputDto enforces exactly what the MotionsInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionsInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionsInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionsInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionsInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...motionsInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
