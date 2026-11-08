import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PromoteResponseDto } from "#/modules/pipeline/dto/promote-response.dto.ts";
import { promoteResponseExample } from "#/modules/pipeline/dto/promote-response.dto.example.ts";

/** Managed by Dryv: PromoteResponseDto enforces exactly what the PromoteResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PromoteResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = promoteResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PromoteResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(promoteResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...promoteResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});