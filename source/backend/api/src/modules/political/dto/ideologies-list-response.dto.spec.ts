import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdeologiesListResponseDto } from "#/modules/political/dto/ideologies-list-response.dto.ts";
import { ideologiesListResponseExample } from "#/modules/political/dto/ideologies-list-response.dto.example.ts";

/** Managed by Dryv: IdeologiesListResponseDto enforces exactly what the IdeologiesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdeologiesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ideologiesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IdeologiesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ideologiesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ideologiesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});