import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartiesListResponseDto } from "#/modules/political/dto/parties-list-response.dto.ts";
import { partiesListResponseExample } from "#/modules/political/dto/parties-list-response.dto.example.ts";

/** Managed by Dryv: PartiesListResponseDto enforces exactly what the PartiesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartiesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partiesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartiesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partiesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partiesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});