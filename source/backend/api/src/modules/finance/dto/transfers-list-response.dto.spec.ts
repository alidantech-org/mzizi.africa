import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TransfersListResponseDto } from "#/modules/finance/dto/transfers-list-response.dto.ts";
import { transfersListResponseExample } from "#/modules/finance/dto/transfers-list-response.dto.example.ts";

/** Managed by Dryv: TransfersListResponseDto enforces exactly what the TransfersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TransfersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = transfersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TransfersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(transfersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...transfersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});