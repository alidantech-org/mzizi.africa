import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** Managed by Dryv: BaseEntityDto enforces exactly what the BaseEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BaseEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = baseEntityExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BaseEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(baseEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...baseEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});