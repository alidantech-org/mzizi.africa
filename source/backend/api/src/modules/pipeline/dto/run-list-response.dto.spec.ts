import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RunListResponseDto } from "#/modules/pipeline/dto/run-list-response.dto.ts";
import { runListResponseExample } from "#/modules/pipeline/dto/run-list-response.dto.example.ts";

/** Managed by Dryv: RunListResponseDto enforces exactly what the RunListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RunListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = runListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RunListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(runListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...runListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});