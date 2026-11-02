import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MethodDto } from "#/modules/source/dto/method.dto.ts";
import { methodExample } from "#/modules/source/dto/method.dto.example.ts";

/** Managed by Dryv: MethodDto enforces exactly what the Method contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MethodDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = methodExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MethodDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(methodExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...methodExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});