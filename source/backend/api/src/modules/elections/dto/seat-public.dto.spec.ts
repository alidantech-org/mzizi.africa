import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatPublicDto } from "#/modules/elections/dto/seat-public.dto.ts";
import { seatPublicExample } from "#/modules/elections/dto/seat-public.dto.example.ts";

/** Managed by Dryv: SeatPublicDto enforces exactly what the SeatPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});