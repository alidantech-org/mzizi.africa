import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatsListResponseDto } from "#/modules/elections/dto/seats-list-response.dto.ts";
import { seatsListResponseExample } from "#/modules/elections/dto/seats-list-response.dto.example.ts";

/** Managed by Dryv: SeatsListResponseDto enforces exactly what the SeatsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});