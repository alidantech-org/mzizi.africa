import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatAllocationPublicDto } from "#/modules/elections/dto/seat-allocation-public.dto.ts";
import { seatAllocationPublicExample } from "#/modules/elections/dto/seat-allocation-public.dto.example.ts";

/** Managed by Dryv: SeatAllocationPublicDto enforces exactly what the SeatAllocationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatAllocationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatAllocationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatAllocationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatAllocationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatAllocationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});