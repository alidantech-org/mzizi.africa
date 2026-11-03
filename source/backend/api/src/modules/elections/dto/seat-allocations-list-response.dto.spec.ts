import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatAllocationsListResponseDto } from "#/modules/elections/dto/seat-allocations-list-response.dto.ts";
import { seatAllocationsListResponseExample } from "#/modules/elections/dto/seat-allocations-list-response.dto.example.ts";

/** Managed by Dryv: SeatAllocationsListResponseDto enforces exactly what the SeatAllocationsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatAllocationsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatAllocationsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatAllocationsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatAllocationsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatAllocationsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});