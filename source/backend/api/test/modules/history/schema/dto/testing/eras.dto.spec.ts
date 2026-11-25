import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ErasDto } from "#/modules/history/schema/dto/eras.dto.ts";
import { erasExample } from "@test/modules/history/schema/dto/examples/eras.dto.example.ts";

/** Managed by Dryv: ErasDto enforces exactly what the Eras contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ErasDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = erasExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ErasDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(erasExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...erasExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
