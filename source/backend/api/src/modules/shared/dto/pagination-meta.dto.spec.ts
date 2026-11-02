import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PaginationMetaDto } from "#/modules/shared/dto/pagination-meta.dto.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** Managed by Dryv: PaginationMetaDto enforces exactly what the PaginationMeta contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PaginationMetaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = paginationMetaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PaginationMetaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(paginationMetaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({ ...paginationMetaExample.valid(), unexpectedField: 1 }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
