import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssetsDto } from "#/modules/geography/schema/dto/assets.dto.ts";
import { assetsExample } from "@test/modules/geography/schema/dto/examples/assets.dto.example.ts";

/** Managed by Dryv: AssetsDto enforces exactly what the Assets contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssetsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = assetsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AssetsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(assetsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...assetsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
