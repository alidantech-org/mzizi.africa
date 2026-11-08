import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatAllocationDto } from "#/modules/elections/dto/seat-allocation.dto.ts";
import { seatAllocationExample } from "#/modules/elections/dto/seat-allocation.dto.example.ts";

/** Managed by Dryv: SeatAllocationDto enforces exactly what the SeatAllocation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatAllocationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatAllocationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatAllocationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatAllocationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatAllocationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});