import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdeologyResponseDto } from "#/modules/political/dto/ideology-response.dto.ts";
import { ideologyResponseExample } from "#/modules/political/dto/ideology-response.dto.example.ts";

/** Managed by Dryv: IdeologyResponseDto enforces exactly what the IdeologyResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdeologyResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ideologyResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IdeologyResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ideologyResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ideologyResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});