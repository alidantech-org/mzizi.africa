import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LangDto } from "#/modules/product/schema/dto/lang.dto.ts";
import { langExample } from "@test/modules/product/schema/dto/examples/lang.dto.example.ts";

/** Managed by Dryv: LangDto enforces exactly what the Lang contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LangDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = langExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LangDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(langExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...langExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
