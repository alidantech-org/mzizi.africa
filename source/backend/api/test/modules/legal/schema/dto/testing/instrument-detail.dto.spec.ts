import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentDetailDto } from "#/modules/legal/schema/dto/instrument-detail.dto.ts";
import { instrumentDetailExample } from "@test/modules/legal/schema/dto/examples/instrument-detail.dto.example.ts";

/** Managed by Dryv: InstrumentDetailDto enforces exactly what the InstrumentDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentDetailExample.valid(),
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
