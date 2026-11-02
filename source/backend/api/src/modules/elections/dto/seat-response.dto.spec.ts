import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatResponseDto } from "#/modules/elections/dto/seat-response.dto.ts";
import { seatResponseExample } from "#/modules/elections/dto/seat-response.dto.example.ts";

/** Managed by Dryv: SeatResponseDto enforces exactly what the SeatResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});