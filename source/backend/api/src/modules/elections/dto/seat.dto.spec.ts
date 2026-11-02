import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatDto } from "#/modules/elections/dto/seat.dto.ts";
import { seatExample } from "#/modules/elections/dto/seat.dto.example.ts";

/** Managed by Dryv: SeatDto enforces exactly what the Seat contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});