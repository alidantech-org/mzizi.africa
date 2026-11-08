import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BidsListResponseDto } from "#/modules/procurement/dto/bids-list-response.dto.ts";
import { bidsListResponseExample } from "#/modules/procurement/dto/bids-list-response.dto.example.ts";

/** Managed by Dryv: BidsListResponseDto enforces exactly what the BidsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BidsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bidsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BidsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bidsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bidsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});