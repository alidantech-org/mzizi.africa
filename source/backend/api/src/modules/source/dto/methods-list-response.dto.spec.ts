import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MethodsListResponseDto } from "#/modules/source/dto/methods-list-response.dto.ts";
import { methodsListResponseExample } from "#/modules/source/dto/methods-list-response.dto.example.ts";

/** Managed by Dryv: MethodsListResponseDto enforces exactly what the MethodsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MethodsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = methodsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MethodsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(methodsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...methodsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});