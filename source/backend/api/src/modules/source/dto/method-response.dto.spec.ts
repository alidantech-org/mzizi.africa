import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MethodResponseDto } from "#/modules/source/dto/method-response.dto.ts";
import { methodResponseExample } from "#/modules/source/dto/method-response.dto.example.ts";

/** Managed by Dryv: MethodResponseDto enforces exactly what the MethodResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MethodResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = methodResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MethodResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(methodResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...methodResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});