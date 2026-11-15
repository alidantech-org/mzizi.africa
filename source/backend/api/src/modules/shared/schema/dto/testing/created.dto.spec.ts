import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CreatedDto } from "#/modules/shared/schema/dto/created.dto.ts";
import { createdExample } from "#/modules/shared/schema/dto/examples/created.dto.example.ts";

/** Managed by Dryv: CreatedDto enforces exactly what the Created contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CreatedDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = createdExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CreatedDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(createdExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...createdExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});