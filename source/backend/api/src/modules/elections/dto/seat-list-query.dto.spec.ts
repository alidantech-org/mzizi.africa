import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeatListQueryDto } from "#/modules/elections/dto/seat-list-query.dto.ts";
import { seatListQueryExample } from "#/modules/elections/dto/seat-list-query.dto.example.ts";

/** Managed by Dryv: SeatListQueryDto enforces exactly what the SeatListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeatListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seatListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SeatListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seatListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seatListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});