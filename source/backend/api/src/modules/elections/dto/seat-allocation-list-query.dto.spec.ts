import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatAllocationListQueryDto } from "#/modules/elections/dto/seat-allocation-list-query.dto.ts";
import { seatAllocationListQueryExample } from "#/modules/elections/dto/seat-allocation-list-query.dto.example.ts";

/** Managed by Dryv: SeatAllocationListQueryDto enforces exactly what the SeatAllocationListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatAllocationListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatAllocationListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatAllocationListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatAllocationListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatAllocationListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});