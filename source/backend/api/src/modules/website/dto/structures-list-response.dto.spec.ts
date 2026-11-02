import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StructuresListResponseDto } from "#/modules/website/dto/structures-list-response.dto.ts";
import { structuresListResponseExample } from "#/modules/website/dto/structures-list-response.dto.example.ts";

/** Managed by Dryv: StructuresListResponseDto enforces exactly what the StructuresListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StructuresListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = structuresListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StructuresListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(structuresListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...structuresListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});