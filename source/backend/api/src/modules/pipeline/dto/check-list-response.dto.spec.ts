import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CheckListResponseDto } from "#/modules/pipeline/dto/check-list-response.dto.ts";
import { checkListResponseExample } from "#/modules/pipeline/dto/check-list-response.dto.example.ts";

/** Managed by Dryv: CheckListResponseDto enforces exactly what the CheckListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CheckListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = checkListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CheckListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(checkListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...checkListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});