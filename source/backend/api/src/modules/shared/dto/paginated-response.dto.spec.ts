import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PaginatedResponseDto } from "#/modules/shared/dto/paginated-response.dto.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";

/** Managed by Dryv: PaginatedResponseDto enforces exactly what the PaginatedResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PaginatedResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = paginatedResponseExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PaginatedResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(paginatedResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...paginatedResponseExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
