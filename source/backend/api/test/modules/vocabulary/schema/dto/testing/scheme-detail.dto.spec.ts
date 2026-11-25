import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SchemeDetailDto } from "#/modules/vocabulary/schema/dto/scheme-detail.dto.ts";
import { schemeDetailExample } from "@test/modules/vocabulary/schema/dto/examples/scheme-detail.dto.example.ts";

/** Managed by Dryv: SchemeDetailDto enforces exactly what the SchemeDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SchemeDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = schemeDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SchemeDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(schemeDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...schemeDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
